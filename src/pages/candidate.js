import React, { Component } from "react";

import CardCandidate from "../components/candidate/cardCandidate";
import TableCandidate from "../components/candidate/tableCandidate";

class Candidate extends Component {
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
        <CardCandidate />
        <div className="flex justify-center w-full items-start gap-16">
          <TableCandidate />
        </div>
      </div>
    );
  }
}

export default Candidate;
