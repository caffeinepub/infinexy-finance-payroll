import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type EmployeeId = Nat;
  type PayslipId = Nat;

  public type Payslip = {
    payslipId : PayslipId;
    employeeUsername : Text;
    employeeName : Text;
    employeeId : EmployeeId;
    panNo : Text;
    aadharNumber : Text;
    designation : Text;
    location : Text;
    businessUnit : Text;
    dateOfBirth : Text;
    dateOfJoining : Text;
    daysPaid : Int;
    month : Text;
    year : Nat;
    basicActual : Int;
    basicPayable : Int;
    mobileAllowanceActual : Int;
    mobileAllowancePayable : Int;
    incentiveActual : Int;
    incentivePayable : Int;
    totalEarningsActual : Int;
    totalEarningsPayable : Int;
    insurance : Int;
    professionTax : Int;
    totalDeductions : Int;
    netPayable : Int;
    paymentMode : Text;
    bankName : Text;
    accountNumber : Text;
    ifscCode : Text;
    createdAt : Int;
  };

  module Payslip {
    public func compare(ps1 : Payslip, ps2 : Payslip) : Order.Order {
      Text.compare(ps1.employeeUsername, ps2.employeeUsername);
    };
  };

  public type Employee = {
    userId : EmployeeId;
    username : Text;
    fullName : Text;
    createdAt : Time.Time;
  };

  module Employee {
    public func compare(e1 : Employee, e2 : Employee) : Order.Order {
      Text.compare(e1.username, e2.username);
    };
  };

  public type UserProfile = {
    username : Text;
    fullName : Text;
    role : Text;
  };

  let employeeIdCounter = Map.empty<EmployeeId, ()>();
  let payslipIdCounter = Map.empty<PayslipId, ()>();
  var nextEmployeeId = 1;
  var nextPayslipId = 1;

  let employees = Map.empty<EmployeeId, Employee>();
  let payslips = Map.empty<PayslipId, Payslip>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let usernameToProfile = Map.empty<Text, (Principal, UserProfile)>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type RegisterEmployeeInput = {
    username : Text;
    fullName : Text;
  };

  public type CreatePayslipInput = {
    employeeUsername : Text;
    employeeName : Text;
    employeeId : EmployeeId;
    panNo : Text;
    aadharNumber : Text;
    designation : Text;
    location : Text;
    businessUnit : Text;
    dateOfBirth : Text;
    dateOfJoining : Text;
    daysPaid : Int;
    month : Text;
    year : Nat;
    basicActual : Int;
    basicPayable : Int;
    mobileAllowanceActual : Int;
    mobileAllowancePayable : Int;
    incentiveActual : Int;
    incentivePayable : Int;
    insurance : Int;
    professionTax : Int;
    paymentMode : Text;
    bankName : Text;
    accountNumber : Text;
    ifscCode : Text;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    usernameToProfile.add(profile.username, (caller, profile));
  };

  public shared ({ caller }) func registerEmployee(employee : RegisterEmployeeInput) : async EmployeeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let employeeId = nextEmployeeId;
    nextEmployeeId += 1;
    employeeIdCounter.add(employeeId, ());

    let newEmployee : Employee = {
      userId = employeeId;
      username = employee.username;
      fullName = employee.fullName;
      createdAt = Time.now();
    };

    employees.add(employeeId, newEmployee);
    employeeId;
  };

  public shared ({ caller }) func createPayslip(payslipInput : CreatePayslipInput) : async PayslipId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let payslipId = nextPayslipId;
    nextPayslipId += 1;
    payslipIdCounter.add(payslipId, ());

    let payslip : Payslip = {
      payslipId;
      employeeUsername = payslipInput.employeeUsername;
      employeeName = payslipInput.employeeName;
      employeeId = payslipInput.employeeId;
      panNo = payslipInput.panNo;
      aadharNumber = payslipInput.aadharNumber;
      designation = payslipInput.designation;
      location = payslipInput.location;
      businessUnit = payslipInput.businessUnit;
      dateOfBirth = payslipInput.dateOfBirth;
      dateOfJoining = payslipInput.dateOfJoining;
      daysPaid = payslipInput.daysPaid;
      month = payslipInput.month;
      year = payslipInput.year;
      basicActual = payslipInput.basicActual;
      basicPayable = payslipInput.basicPayable;
      mobileAllowanceActual = payslipInput.mobileAllowanceActual;
      mobileAllowancePayable = payslipInput.mobileAllowancePayable;
      incentiveActual = payslipInput.incentiveActual;
      incentivePayable = payslipInput.incentivePayable;
      totalEarningsActual = payslipInput.basicActual + payslipInput.mobileAllowanceActual + payslipInput.incentiveActual;
      totalEarningsPayable = payslipInput.basicPayable + payslipInput.mobileAllowancePayable + payslipInput.incentivePayable;
      insurance = payslipInput.insurance;
      professionTax = payslipInput.professionTax;
      totalDeductions = payslipInput.insurance + payslipInput.professionTax;
      netPayable = payslipInput.basicPayable + payslipInput.mobileAllowancePayable + payslipInput.incentivePayable - (payslipInput.insurance + payslipInput.professionTax);
      paymentMode = payslipInput.paymentMode;
      bankName = payslipInput.bankName;
      accountNumber = payslipInput.accountNumber;
      ifscCode = payslipInput.ifscCode;
      createdAt = Time.now();
    };

    payslips.add(payslipId, payslip);
    payslipId;
  };

  public query ({ caller }) func listAllEmployees() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    employees.values().toArray().sort();
  };

  public query ({ caller }) func listAllPayslips() : async [Payslip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    payslips.values().toArray().sort();
  };

  public query ({ caller }) func listPayslipsByEmployee(username : Text) : async [Payslip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view payslips");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    if (not isAdmin) {
      switch (userProfiles.get(caller)) {
        case (null) {
          Runtime.trap("Unauthorized: User profile not found");
        };
        case (?profile) {
          if (profile.username != username) {
            Runtime.trap("Unauthorized: Employees can only view their own payslips");
          };
        };
      };
    };

    payslips.values().toArray().sort().filter(
      func(p) { p.employeeUsername == username }
    );
  };

  public query ({ caller }) func getPayslip(payslipId : PayslipId) : async ?Payslip {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view payslips");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    switch (payslips.get(payslipId)) {
      case (null) { null };
      case (?payslip) {
        if (not isAdmin) {
          switch (userProfiles.get(caller)) {
            case (null) {
              Runtime.trap("Unauthorized: User profile not found");
            };
            case (?profile) {
              if (profile.username != payslip.employeeUsername) {
                Runtime.trap("Unauthorized: Employees can only view their own payslips");
              };
            };
          };
        };
        ?payslip;
      };
    };
  };

  public shared ({ caller }) func deletePayslip(payslipId : PayslipId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    switch (payslips.get(payslipId)) {
      case (null) { Runtime.trap("Payslip does not exist") };
      case (?_) {
        payslips.remove(payslipId);
      };
    };
  };

  public query ({ caller }) func getEmployee(employeeId : EmployeeId) : async ?Employee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    employees.get(employeeId);
  };

  public query ({ caller }) func getAllPayslips() : async [Payslip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    payslips.values().toArray().sort();
  };
};
