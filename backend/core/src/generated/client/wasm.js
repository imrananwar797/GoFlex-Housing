
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  full_name: 'full_name',
  phone: 'phone',
  password_hash: 'password_hash',
  role: 'role',
  two_factor_enabled: 'two_factor_enabled',
  two_factor_secret: 'two_factor_secret',
  referral_code: 'referral_code',
  referred_by: 'referred_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.PropertyScalarFieldEnum = {
  id: 'id',
  owner_id: 'owner_id',
  name: 'name',
  description: 'description',
  city: 'city',
  state: 'state',
  state_iso: 'state_iso',
  address: 'address',
  beds: 'beds',
  baths: 'baths',
  rent: 'rent',
  occupancy: 'occupancy',
  amenities: 'amenities',
  featured_image: 'featured_image',
  cover_image_url: 'cover_image_url',
  verified: 'verified',
  active: 'active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  resident_id: 'resident_id',
  room_id: 'room_id',
  check_in_date: 'check_in_date',
  check_out_date: 'check_out_date',
  total_guests: 'total_guests',
  total_amount: 'total_amount',
  status: 'status',
  payment_status: 'payment_status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.PaymentTransactionScalarFieldEnum = {
  id: 'id',
  booking_id: 'booking_id',
  user_id: 'user_id',
  stripe_payment_id: 'stripe_payment_id',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.EscrowAccountScalarFieldEnum = {
  id: 'id',
  booking_id: 'booking_id',
  user_id: 'user_id',
  amount_held: 'amount_held',
  status: 'status',
  release_date: 'release_date',
  dispute_reason: 'dispute_reason',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.FraudAlertScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  booking_id: 'booking_id',
  severity: 'severity',
  alert_type: 'alert_type',
  description: 'description',
  status: 'status',
  score: 'score',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.KYCScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  document_type: 'document_type',
  document_url: 'document_url',
  status: 'status',
  reviewed_by: 'reviewed_by',
  review_notes: 'review_notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  user_id: 'user_id',
  rating: 'rating',
  comment: 'comment',
  is_featured: 'is_featured',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  sender_id: 'sender_id',
  content: 'content',
  is_read: 'is_read',
  created_at: 'created_at'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  type: 'type',
  title: 'title',
  message: 'message',
  read: 'read',
  created_at: 'created_at'
};

exports.Prisma.SubscriptionPlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  interval: 'interval',
  features: 'features',
  active: 'active',
  created_at: 'created_at'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  plan_id: 'plan_id',
  stripe_subscription_id: 'stripe_subscription_id',
  status: 'status',
  current_period_start: 'current_period_start',
  current_period_end: 'current_period_end',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.BlogPostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  excerpt: 'excerpt',
  content: 'content',
  featured_image: 'featured_image',
  category: 'category',
  tags: 'tags',
  view_count: 'view_count',
  published_at: 'published_at',
  author_id: 'author_id'
};

exports.Prisma.TestimonialScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  content: 'content',
  avatar_url: 'avatar_url',
  rating: 'rating',
  created_at: 'created_at'
};

exports.Prisma.FAQScalarFieldEnum = {
  id: 'id',
  question: 'question',
  answer: 'answer',
  category: 'category',
  active: 'active'
};

exports.Prisma.PropertyPhotoScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  url: 'url',
  alt_text: 'alt_text'
};

exports.Prisma.RoomScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  name: 'name',
  type: 'type',
  floor: 'floor',
  capacity: 'capacity',
  rent: 'rent',
  is_occupied: 'is_occupied',
  amenities: 'amenities',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ComplaintScalarFieldEnum = {
  id: 'id',
  resident_id: 'resident_id',
  property_id: 'property_id',
  room_id: 'room_id',
  category: 'category',
  priority: 'priority',
  title: 'title',
  description: 'description',
  status: 'status',
  resolved_at: 'resolved_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.VisitorLogScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  resident_id: 'resident_id',
  visitor_name: 'visitor_name',
  visitor_phone: 'visitor_phone',
  purpose: 'purpose',
  check_in: 'check_in',
  check_out: 'check_out',
  approved: 'approved',
  created_at: 'created_at'
};

exports.Prisma.RentalAgreementScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  resident_id: 'resident_id',
  owner_id: 'owner_id',
  room_id: 'room_id',
  rent_amount: 'rent_amount',
  security_deposit: 'security_deposit',
  start_date: 'start_date',
  end_date: 'end_date',
  notice_period: 'notice_period',
  clauses: 'clauses',
  status: 'status',
  resident_signed: 'resident_signed',
  owner_signed: 'owner_signed',
  resident_signed_at: 'resident_signed_at',
  owner_signed_at: 'owner_signed_at',
  pdf_url: 'pdf_url',
  digilocker_ref: 'digilocker_ref',
  renewal_reminder: 'renewal_reminder',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.GoFlexScoreScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  overall_score: 'overall_score',
  payment_score: 'payment_score',
  compliance_score: 'compliance_score',
  complaint_score: 'complaint_score',
  verification_score: 'verification_score',
  maintenance_score: 'maintenance_score',
  responsiveness_score: 'responsiveness_score',
  total_reviews: 'total_reviews',
  avg_rating: 'avg_rating',
  is_verified: 'is_verified',
  verification_badge: 'verification_badge',
  updated_at: 'updated_at'
};

exports.Prisma.CommunityPostScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  author_id: 'author_id',
  type: 'type',
  title: 'title',
  content: 'content',
  image_url: 'image_url',
  is_pinned: 'is_pinned',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ServiceRequestScalarFieldEnum = {
  id: 'id',
  resident_id: 'resident_id',
  property_id: 'property_id',
  service_type: 'service_type',
  description: 'description',
  scheduled_at: 'scheduled_at',
  status: 'status',
  cost_estimate: 'cost_estimate',
  final_cost: 'final_cost',
  provider_name: 'provider_name',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UtilityReadingScalarFieldEnum = {
  id: 'id',
  property_id: 'property_id',
  room_id: 'room_id',
  month: 'month',
  year: 'year',
  electricity: 'electricity',
  water: 'water',
  wifi_usage: 'wifi_usage',
  electricity_bill: 'electricity_bill',
  water_bill: 'water_bill',
  wifi_bill: 'wifi_bill',
  total_bill: 'total_bill',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.userrole = exports.$Enums.userrole = {
  ADMIN: 'ADMIN',
  RESIDENT: 'RESIDENT',
  OWNER: 'OWNER',
  STAFF: 'STAFF'
};

exports.Prisma.ModelName = {
  User: 'User',
  Property: 'Property',
  Booking: 'Booking',
  PaymentTransaction: 'PaymentTransaction',
  EscrowAccount: 'EscrowAccount',
  FraudAlert: 'FraudAlert',
  KYC: 'KYC',
  Review: 'Review',
  Message: 'Message',
  Notification: 'Notification',
  SubscriptionPlan: 'SubscriptionPlan',
  Subscription: 'Subscription',
  BlogPost: 'BlogPost',
  Testimonial: 'Testimonial',
  FAQ: 'FAQ',
  PropertyPhoto: 'PropertyPhoto',
  Room: 'Room',
  Complaint: 'Complaint',
  VisitorLog: 'VisitorLog',
  RentalAgreement: 'RentalAgreement',
  GoFlexScore: 'GoFlexScore',
  CommunityPost: 'CommunityPost',
  ServiceRequest: 'ServiceRequest',
  UtilityReading: 'UtilityReading'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
