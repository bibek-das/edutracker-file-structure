const Department = require("../../models/admin/department");

let deptInserted = false;
exports.addDept = async (req, res) => {
  try {
    if (!deptInserted) {
      const cseInfo = {
        deptID: 115,
        deptName: "CSE",
        deptFullName: "Computer Science & Engineering",
      };
      const eeeInfo = {
        deptID: 141,
        deptName: "EEE",
        deptFullName: "Electrical & Electronics Engineering",
      };
      const sweInfo = {
        deptID: 107,
        deptName: "SWE",
        deptFullName: "Software Engineering",
      };
      const bbaInfo = {
        deptID: 116,
        deptName: "BBA",
        deptFullName: "Business Administration",
      };
      const llbInfo = {
        deptID: 117,
        deptName: "LLB",
        deptFullName: "Law",
      };
      const engInfo = {
        deptID: 114,
        deptName: "ENG",
        deptFullName: "English",
      };
      const ecoInfo = {
        deptID: 111,
        deptName: "ECO",
        deptFullName: "Economics",
      };
      const CSE = new Department(cseInfo);
      const EEE = new Department(eeeInfo);
      const SWE = new Department(sweInfo);
      const BBA = new Department(bbaInfo);
      const LLB = new Department(llbInfo);
      const ECO = new Department(ecoInfo);
      const ENG = new Department(engInfo);

      await CSE.save();
      await EEE.save();
      await SWE.save();
      await BBA.save();
      await LLB.save();
      await ECO.save();
      await ENG.save();

      deptInserted = true;
    }
    if (deptInserted) {
      res.send("Departments are inserted");
    }
  } catch {
    res.send("Departments are inserted");
  }
};
