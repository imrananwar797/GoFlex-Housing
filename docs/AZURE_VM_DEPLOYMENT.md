# Deploying GoFlex Housing on Azure VM (Virtual Machine)

This guide provides a comprehensive walkthrough for deploying the GoFlex Housing multi-service application (React frontend, Node.js Core backend, Python FastAPI AI backend, PostgreSQL database, Redis, and Nginx reverse proxy) on a Microsoft Azure Virtual Machine.

---

## 🏗️ Deployment Architecture

On the Azure VM, the services will run in a containerized environment managed by **Docker Compose**:

```
                  ┌──────────────────────────────────────────────┐
                  │                   Azure VM                   │
                  │                                              │
                  │                  Port 80/443                 │
                  │                       │                      │
                  │                       ▼                      │
                  │             goflex-nginx-prod (Nginx)        │
                  │             ┌─────────┴─────────┐            │
                  │             │ Static Assets     │ API        │
                  │             ▼ (frontend/dist)   ▼            │
                  │       (Client Browser)     goflex-backend    │
                  │                            (Node.js Core)    │
                  │                                 │            │
                  │              ┌──────────────────┼──────────┐ │
                  │              ▼                  ▼          ▼ │
                  │        goflex-redis       goflex-backend-ai  │
                  │           (Redis)           (Python FastAPI) │
                  │                                 │            │
                  │                                 ▼            │
                  │                          goflex-postgres     │
                  │                            (PostgreSQL)      │
                  └──────────────────────────────────────────────┘
```

---

## Step 1: Provision the Azure Virtual Machine

### 1. VM Configuration
Sign in to the [Azure Portal](https://portal.azure.com/) and create a new **Virtual Machine**:
- **Subscription**: Select your active Azure subscription.
- **Resource Group**: Create a new one or select an existing one (e.g., `goflex-housing-rg`).
- **VM Name**: `goflex-prod-vm`
- **Region**: Choose a region closest to your users.
- **Availability options**: No infrastructure redundancy required (unless high availability is needed).
- **Image**: **Ubuntu Server 22.04 LTS - x64 Gen2** (or Ubuntu 24.04 LTS).
- **Size**: **Standard_B2ms** (2 vCPUs, 8 GiB memory). 
  > [!IMPORTANT]
  > Because the Python AI service runs face-recognition algorithms and the Node/Vite frontend needs to compile, a minimum of 4 GiB (preferably 8 GiB) RAM is highly recommended to prevent build-time out-of-memory crashes.
- **Authentication type**: **SSH public key** (recommended for security) or Password.
- **Username**: `azureuser`

### 2. Inbound Port Rules
In the **Networking** tab, configure the network security group (NSG) to allow the following inbound traffic:
- **SSH (Port 22)**: To allow remote terminal access. (Restricting source IP to your own public IP is recommended).
- **HTTP (Port 80)**: For initial web traffic and Let's Encrypt verification.
- **HTTPS (Port 443)**: For secure encrypted web traffic.

Click **Review + create**, then click **Create** and download your private SSH key (`.pem` file) if prompted.

---

## Step 2: Configure DNS

To serve your application over HTTPS and connect it with SSL, you must point a domain or subdomain to your Azure VM's public IP address:
1. In the Azure Portal, navigate to your newly created VM's **Overview** page.
2. Locate the **Public IP address**.
3. Go to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare) and create an **A Record**:
   - **Host / Name**: `@` (for main domain) or `goflex` (for subdomain, e.g., `goflex.yourdomain.com`).
   - **Value / Points to**: `<Your-VM-Public-IP>`.
   - **TTL**: `3600` (1 hour).

---

## Step 3: Install Server Dependencies

SSH into your Azure VM using the downloaded private key:
```bash
chmod 400 your-key.pem
ssh -i your-key.pem azureuser@<your-vm-public-ip>
```

Once connected, run the following commands to update the system and install Docker, Docker Compose, Git, and Node.js.

### 1. Update the System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

### 3. Manage Docker as a Non-Root User
```bash
sudo usermod -aG docker $USER
newgrp docker
```
*Verify Docker is running by executing `docker ps`.*

### 4. Install Node.js (For building the frontend on the host)
The production Nginx container loads the built frontend code from the host's directory (`./apps/frontend/dist`). Therefore, we need Node.js to compile it on the server:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Step 4: Clone the Project & Setup Environment Variables

### 1. Clone the Codebase
```bash
git clone <your-repository-git-url> goflex-housing
cd goflex-housing
```

### 2. Configure Production Secrets
Create a `.env` file in the root folder of the project:
```bash
cp .env.example .env
nano .env
```

Configure your production-specific environment variables. 
Make sure you update the following key variables:
```env
# Database Configuration (Docker container names link automatically)
DB_USER=goflex_admin
DB_PASSWORD=your_super_secure_random_db_password
DB_NAME=goflex_production

# Application Settings
DEBUG=False
SECRET_KEY=generate_a_long_secure_random_hex_string
FRONTEND_URL=https://goflex.yourdomain.com
CORS_ORIGINS=["https://goflex.yourdomain.com"]

# Stripe Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email & SMS Settings
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_smtp_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Optional Redis
REDIS_URL=redis://goflex-redis-prod:6379
```

Also, create a production `.env` for the core backend if it requires direct file loading:
```bash
cp backend/core/.env.example backend/core/.env
# Verify the configuration inside backend/core/.env matches production settings
```

---

## Step 5: Build the Frontend Assets

Since the production `docker-compose.prod.yml` mounts `./apps/frontend/dist` to Nginx, build the React frontend on the host:

```bash
# Install packages in the monorepo root
npm install

# Build the frontend using Turbo
npm run build
```

This compiles the static assets into `./apps/frontend/dist`.

---

## Step 6: Deploy Containers with Docker Compose

Run the production Docker Compose setup:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### How Database Initialization Works:
On the first run, the postgres container automatically executes the scripts inside:
1. `backend/ai/database/init.sql` (Creates DB roles/privileges)
2. `backend/ai/database/schema.sql` (Builds tables and indexes)
3. `backend/ai/database/seed.sql` (Inserts initial seed records)

### Verify Container Status:
To ensure all services (postgres, backend, backend-ai, redis, and nginx) are running correctly:
```bash
docker compose -f docker-compose.prod.yml ps
```
To view logs:
```bash
docker compose -f docker-compose.prod.yml logs -f
```

---

## Step 7: Configure SSL / HTTPS (Let's Encrypt & Certbot)

To secure the application with HTTPS, configure SSL certificates on Nginx.

### 1. Install Certbot on the VM Host
```bash
sudo apt install certbot -y
```

### 2. Generate the SSL Certificates
Stop the Docker containers temporarily to free up ports `80` and `443`:
```bash
docker compose -f docker-compose.prod.yml down
```

Run Certbot to request a certificate:
```bash
sudo certbot certonly --standalone -d goflex.yourdomain.com
```
Follow the interactive prompts (enter email, accept terms). The certificates will be generated and saved in `/etc/letsencrypt/live/goflex.yourdomain.com/`.

### 3. Update Nginx Configuration to Enable SSL
Modify `nginx/nginx.conf` or mount a custom Nginx configuration that references these certificates.

Let's modify `docker-compose.prod.yml` to mount the certificate folder into Nginx:
```yaml
  nginx:
    image: nginx:alpine
    container_name: goflex-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro # SSL-specific site config
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./apps/frontend/dist:/var/www/html:ro
```

Here is a recommended production SSL config file `nginx/nginx-ssl.conf`:
```nginx
server {
    listen 80;
    server_name goflex.yourdomain.com;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name goflex.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/goflex.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/goflex.yourdomain.com/privkey.pem;

    # Secure SSL Protocols and Ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Serve Frontend static files
    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Health Check
    location /health {
        access_log off;
        return 200 "healthy\n";
    }
}
```

Start the containers up again:
```bash
docker compose -f docker-compose.prod.yml up -d
```

### 4. Automate SSL Renewal
Let's Encrypt certificates are valid for 90 days. Set up a systemd cron job to renew them automatically and reload Nginx:
```bash
sudo crontab -e
```
Add the following line to check and renew weekly at 2:00 AM, automatically reloading Nginx containers afterwards:
```cron
0 2 * * 0 certbot renew --post-hook "docker exec goflex-nginx-prod nginx -s reload"
```

---

## 🛠️ Post-Deployment Monitoring & Maintenance

### 1. Inspecting Live Logs
```bash
# View backend logs
docker logs -f goflex-backend-prod

# View python AI backend logs
docker logs -f goflex-backend-ai-prod

# View nginx proxy logs
docker logs -f goflex-nginx-prod
```

### 2. Running Database Backups
To run a database snapshot on the Postgres container and save it to the VM host:
```bash
docker exec -t goflex-postgres-prod pg_dump -U goflex_admin goflex_production > ~/backups/db_backup_$(date +%F).sql
```

### 3. Code Updates (CI/CD Deployment Script)
Create a quick release script `deploy.sh` on the VM for one-command updates:
```bash
#!/bin/bash
git pull origin main
npm install
npm run build
docker compose -f docker-compose.prod.yml up -d --build
```
Make it executable: `chmod +x deploy.sh` and run `./deploy.sh` whenever you push changes to main.
