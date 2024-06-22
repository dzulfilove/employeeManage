import React, { Component } from "react";
import CardEmployee from "../components/employee/cardEmployee";
import TableEmployee from "../components/employee/tableEmployee";

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKosong: [],
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-3xl mb-6">
          Kandidat Calon Karyawan
        </div>
        <CardEmployee />
        <div className="flex justify-center w-full items-start gap-16">
          <TableEmployee />
        </div>
      </div>
    );
  }
}

export default Employee;
