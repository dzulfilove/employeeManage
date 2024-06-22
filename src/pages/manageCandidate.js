import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SubCard from "../components/candidate/subCard";
import MainCard from "../components/candidate/manageCandidateCard";

class ManageCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      droppedItems: [
        { name: "adi", tahap: "awal" },
        { name: "Budi", tahap: "awal" },
      ],
      droppedItems2: [
        { name: "Ali", tahap: "admin" },
        { name: "Heru", tahap: "admin" },
      ],
      droppedItems3: [
        { name: "Waduh", tahap: "interview" },
        { name: "Ganjar", tahap: "interview" },
      ],
      droppedItems4: [
        { name: "Mamank", tahap: "training" },
        { name: "Garox", tahap: "training" },
      ],
      itemNew: null,
    };
  }

  handleDrop = (item) => {
    console.log("Item Lama", this.state.itemNew);

    // Update droppedItems2
    const updatedDroppedItems2 = [...this.state.droppedItems, item];
    this.setState({
      droppedItems: updatedDroppedItems2,
      itemNew: item,
    });

    // Update droppedItems

    if (item.tahap == "admin") {
      const updatedDropItems = this.state.droppedItems2.filter(
        (data) => data.name !== item.name
      );

      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems2: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems2: updatedDropItems,
        });
      }
    } else if (item.tahap == "interview") {
      const updatedDropItems = this.state.droppedItems3.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems3: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems3: updatedDropItems,
        });
      }
    } else {
      const updatedDropItems = this.state.droppedItems4.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems4: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems4: updatedDropItems,
        });
      }
    }
  };
  handleDrop2 = (item) => {
    console.log("Item Lama", item);

    // Update droppedItems2
    const updatedDroppedItems2 = [...this.state.droppedItems2, item];
    this.setState({
      droppedItems2: updatedDroppedItems2,
      itemNew: item,
    });

    // Update droppedItems
    if (item.tahap == "awal") {
      const updatedDropItems = this.state.droppedItems.filter(
        (data) => data.name !== item.name
      );

      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems: updatedDropItems,
        });
      }
    } else if (item.tahap == "interview") {
      const updatedDropItems = this.state.droppedItems3.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems3: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems3: updatedDropItems,
        });
      }
    } else {
      const updatedDropItems = this.state.droppedItems4.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems4: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems4: updatedDropItems,
        });
      }
    }
    console.log("Updated droppedItems2:", updatedDroppedItems2);
    console.log("Updated droppedItems:");
  };
  handleDrop3 = (item) => {
    console.log("Item Lama", this.state.itemNew);

    // Update droppedItems2
    const updatedDroppedItems2 = [...this.state.droppedItems3, item];
    this.setState({
      droppedItems3: updatedDroppedItems2,
      itemNew: item,
    });

    if (item.tahap == "admin") {
      const updatedDropItems = this.state.droppedItems2.filter(
        (data) => data.name !== item.name
      );

      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems2: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems2: updatedDropItems,
        });
      }
    } else if (item.tahap == "awal") {
      const updatedDropItems = this.state.droppedItems.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems: updatedDropItems,
        });
      }
    } else {
      const updatedDropItems = this.state.droppedItems4.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems4: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems4: updatedDropItems,
        });
      }
    }
    console.log("Updated droppedItems:", updatedDroppedItems2);
    console.log("Updated droppedItems2:");
  };
  handleDrop4 = (item) => {
    console.log("Item Lama", this.state.itemNew);

    // Update droppedItems2
    const updatedDroppedItems2 = [...this.state.droppedItems4, item];
    this.setState({
      droppedItems4: updatedDroppedItems2,
      itemNew: item,
    });

    // Update droppedItems
    if (item.tahap == "admin") {
      const updatedDropItems = this.state.droppedItems2.filter(
        (data) => data.name !== item.name
      );

      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems2: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems2: updatedDropItems,
        });
      }
    } else if (item.tahap == "interview") {
      const updatedDropItems = this.state.droppedItems3.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems3: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems3: updatedDropItems,
        });
      }
    } else {
      const updatedDropItems = this.state.droppedItems.filter(
        (data) => data.name !== item.name
      );
      if (this.state.itemNew !== null) {
        const newDataBaru = [...updatedDropItems];
        this.setState({
          droppedItems: newDataBaru,
        });
      } else {
        this.setState({
          droppedItems: updatedDropItems,
        });
      }
    }
    console.log("Updated droppedItems:", updatedDroppedItems2);
    console.log("Updated droppedItems2:");
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div>
          <div className="flex w-full justify-start p-4 items-center text-white text-3xl mb-6">
            Manajemen Calon Kandidat Karyawan
          </div>
          <div className="w-full flex  mt-20 justify-between items-start">
            <div
              data-aos="fade-down"
              data-aos-delay="50"
              className="w-[25rem] h-auto flex flex-col justify-start items-center relative gap-10 rounded-lg p-4 overflow-hidden"
            >
              <div className="w-[25rem] absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

              <div className="w-full p-2  text-white bg-transparent shadow-xl text-lg  border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                <h4>Tahap Awal Seleksi</h4>
              </div>
              <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                {this.state.droppedItems.map((item, index) => (
                  <SubCard key={index} name={item} />
                ))}
                <MainCard onDrop={this.handleDrop} />
              </div>
            </div>
            <div
              data-aos="fade-down"
              data-aos-delay="150"
              className="w-[25rem] h-auto flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
            >
              <div className="w-[25rem] absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

              <div className="w-full p-2  text-white bg-transparent shadow-xl  text-lg border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                <h4>Tahap Administrasi</h4>
              </div>
              <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                {this.state.droppedItems2.map((item, index) => (
                  <SubCard key={index} name={item} />
                ))}
                <MainCard onDrop={this.handleDrop2} />
              </div>
            </div>
            <div
              data-aos="fade-down"
              data-aos-delay="250"
              className="w-[25rem] h-auto flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
            >
              <div className="w-[25rem]  absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

              <div className="w-full p-2  text-white bg-transparent shadow-xl text-lg border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                <h4>Tahap Interview</h4>
              </div>
              <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                {this.state.droppedItems3.map((item, index) => (
                  <SubCard key={index} name={item} />
                ))}
                <MainCard onDrop={this.handleDrop3} />
              </div>
            </div>
            <div
              data-aos="fade-down"
              data-aos-delay="350"
              className="w-[25rem] h-auto flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
            >
              <div className="w-[25rem] absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

              <div className="w-full p-2  text-white bg-transparent shadow-xl text-lg border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                <h4>Tahap Training</h4>
              </div>
              <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                {this.state.droppedItems4.map((item, index) => (
                  <SubCard key={index} name={item} />
                ))}
                <MainCard onDrop={this.handleDrop4} />
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
}

export default ManageCandidate;
