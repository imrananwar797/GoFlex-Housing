// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GoFlexEscrow
 * @dev Secure, gas-optimized escrow for property security deposits on Polygon.
 */
contract GoFlexEscrow is Ownable, ReentrancyGuard {
    
    enum EscrowStatus { HELD, RELEASED, DISPUTED, REFUNDED }

    struct Escrow {
        address tenant;
        address owner;
        uint256 amount;
        EscrowStatus status;
        string bookingId;
    }

    mapping(string => Escrow) public escrows;
    
    event FundsDeposited(string bookingId, address tenant, uint256 amount);
    event FundsReleased(string bookingId, address owner, uint256 amount);
    event DisputeOpened(string bookingId);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Deposit funds into escrow.
     * @param _bookingId Unique identifier from Node.js backend.
     * @param _owner The property owner's wallet address.
     */
    function deposit(string memory _bookingId, address _owner) external payable nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        require(escrows[_bookingId].amount == 0, "Escrow already exists");

        escrows[_bookingId] = Escrow({
            tenant: msg.sender,
            owner: _owner,
            amount: msg.value,
            status: EscrowStatus.HELD,
            bookingId: _bookingId
        });

        emit FundsDeposited(_bookingId, msg.sender, msg.value);
    }

    /**
     * @dev Release funds to the owner. Only callable by GoFlex Admin or automated oracle.
     */
    function release(string memory _bookingId) external onlyOwner nonReentrant {
        Escrow storage escrow = escrows[_bookingId];
        require(escrow.status == EscrowStatus.HELD, "Invalid status");

        escrow.status = EscrowStatus.RELEASED;
        payable(escrow.owner).transfer(escrow.amount);

        emit FundsReleased(_bookingId, escrow.owner, escrow.amount);
    }

    /**
     * @dev Open a dispute. Prevents immediate release.
     */
    function openDispute(string memory _bookingId) external {
        Escrow storage escrow = escrows[_bookingId];
        require(msg.sender == escrow.tenant || msg.sender == owner(), "Unauthorized");
        require(escrow.status == EscrowStatus.HELD, "Invalid status");

        escrow.status = EscrowStatus.DISPUTED;
        emit DisputeOpened(_bookingId);
    }
}
