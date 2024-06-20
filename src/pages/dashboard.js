import React, { Component } from "react";
import CardDashboard from "../components/dashboard/cardDashboard";
import TableDashboard from "../components/dashboard/tableDashboard";
import TableDashboardDivision from "../components/dashboard/tableDashboardDivision";

class Dashboard extends Component {
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
          Employee Management System
        </div>
        <CardDashboard />
        <div className="flex justify-between w-full items-start gap-16">
          <TableDashboard />

          <TableDashboardDivision />
        </div>
      </div>
    );
  }
}

export default Dashboard;
