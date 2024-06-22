import React, { Component } from "react";

import CardDetailEmployee from "../components/employee/cardDetailEmployee";
import TableEmployeeDetail from "../components/employee/tableEmployeeDetail";

class EmployeeDetail extends Component {
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
          Data Detail Karyawan
        </div>

        <CardDetailEmployee />

        <div className="flex justify-center w-full items-start gap-16">
          <TableEmployeeDetail />
        </div>
      </div>
    );
  }
}

export default EmployeeDetail;
