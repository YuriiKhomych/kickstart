// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvedByContributors;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimum, address creator) {
        manager = payable(creator);
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[payable(msg.sender)] = true;
        approversCount++;
    }

    function createRequest(string calldata description, uint value, address payable recipient) public restricted {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.approvalCount = 0;
        newRequest.complete = false;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvedByContributors[msg.sender]);

        request.approvedByContributors[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
        minimumContribution,
        address(this).balance,
        requests.length,
        approversCount,
        manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
