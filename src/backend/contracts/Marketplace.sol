// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
    uint public itemCount;           // total items listed
    uint public feePercent;          // marketplace fee %
    address public feeAccount;       // account receiving the fee

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    mapping(uint => Item) public items;

    event Offered(uint itemId, address indexed nft, uint tokenId, uint price, address indexed seller);
    event Bought(uint itemId, address indexed nft, uint tokenId, uint price, address indexed seller, address indexed buyer);

    constructor(uint _feePercent) {
        feeAccount = msg.sender;
        feePercent = _feePercent;
    }

    // list NFT for sale
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external {
        require(_price > 0, "Price must be > 0");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item({
            itemId: itemCount,
            nft: _nft,
            tokenId: _tokenId,
            price: _price,
            seller: payable(msg.sender),
            sold: false
        });

        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    // buy NFT
    function purchaseItem(uint _itemId) external payable {
        Item storage item = items[_itemId];
        uint totalPrice = getTotalPrice(_itemId);

        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(msg.value >= totalPrice, "Not enough ETH");
        require(!item.sold, "Already sold");

        // pay seller and marketplace
        item.seller.transfer(item.price);
        payable(feeAccount).transfer(totalPrice - item.price);

        // transfer NFT to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        item.sold = true;

        emit Bought(item.itemId, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);
    }

    // view total price (item + fee)
    function getTotalPrice(uint _itemId) public view returns (uint) {
        return (items[_itemId].price * (100 + feePercent)) / 100;
    }
}
