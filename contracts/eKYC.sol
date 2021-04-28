pragma solidity >=0.4.21 <=0.8.0;
pragma experimental ABIEncoderV2;

contract eKYC {
  struct UserData {
    uint NID;
    uint DOB;
    string name;
    string userAddress;
    string email;
    uint phone;
    bool gender;
    string passport;
  }
  mapping (address => UserData) userMetaData;

  struct KYCRequest {
    address FI;
    bool approval;
  }
  mapping (address => KYCRequest) kycRequest;

  event UserExist(address user, bool value);
  event UserApproval(address user, bool approval, bool test);

  uint public initKYC;

  constructor(uint arg) public {
    initKYC = arg;
  }

  function setUserKYC(uint arg) public {
    initKYC = arg;
  }

  function getUserKYC() view public returns (uint) {
    return initKYC;
  }

  function checkUserExistence(uint NID, uint DOB) public {
    if (userMetaData[msg.sender].NID == NID && userMetaData[msg.sender].DOB == DOB) {
      emit UserExist(msg.sender, true);
    }
  }

  function addUserMetaData() public {
    UserData memory newUserData = UserData(1, 123, "name", "address", "email", 123, true, "passport");
    userMetaData[msg.sender] = newUserData;
  }

  function updateUserMetaData(string memory argUserAddress,
    string memory argUserEmail, uint argPhone) public {
    userMetaData[msg.sender].userAddress = argUserAddress;
    userMetaData[msg.sender].email = argUserEmail;
    userMetaData[msg.sender].phone = argPhone;
  }

  function getUserNID() view public returns (uint) {
    return (userMetaData[msg.sender].NID);
  }

  function getUserMetaData() view public returns (uint, uint) {
    return (userMetaData[msg.sender].NID, userMetaData[msg.sender].DOB);
  }

  function getUserKYCApproval() public {
    emit UserApproval(msg.sender, true, true);
  }

  function storeUserApproval(bool approveOrNot) public returns (bool retVal) {
    kycRequest[msg.sender].approval = approveOrNot;
    return kycRequest[msg.sender].approval;
  }

  function getKYCRequetStatus() view public returns (bool retVal) {
    return kycRequest[msg.sender].approval;
  }
}

