<div className="w-full flex  mt-20 justify-between items-start">
<div className="w-[25rem] h-auto flex flex-col justify-start items-center relative gap-10 rounded-lg p-4">
  <div className="w-[25rem] absolute bg-slate-400 opacity-15 h-[10rem] flex flex-col justify-start gap-10 rounded-lg"></div>

  <div className="w-full p-2  text-white bg-transparent shadow-xl  border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
    <h4>Tahap Administrasi</h4>
  </div>
  <div className="flex gap-4 flex-col justify-start items-center w-full">
    {this.state.droppedItems.map((item, index) => (
      <SubCard key={index} name={item.name} />
    ))}
    <MainCard onDrop={this.handleDrop} />
  </div>
</div>
<div
  style={{
    display: "flex",
    justifyContent: "space-around",
  }}
>
  <div
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "5px",
    }}
  >
    <h2>Drag Items</h2>
    {this.state.droppedItems2.map((item, index) => (
      <SubCard key={index} name={item.name} />
    ))}
    <MainCard onDrop={this.handleDrop2} />
  </div>
</div>
</div>