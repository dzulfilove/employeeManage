<div className="bg-yellow w-full h-full overflow-y-scroll flex flex-col justify-center items-center p-4">
<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Email</h3>
  <input
    type="email"
    name="email"
    value={this.state.email}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Nama:</h3>
  <input
    type="text"
    name="nama"
    value={this.state.nama}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">NIK:</h3>
  <input
    type="number"
    name="nik"
    value={this.state.nik}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Alamat:</h3>
  <input
    type="text"
    name="alamat"
    value={this.state.alamat}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Nomor Whatsapp:</h3>
  <input
    type="text"
    name="nomorWhatsapp"
    value={this.state.nomorWhatsapp}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 htmlFor="posisi">Posisi:</h3>
  <select
    id="posisi"
    name="posisi"
    value={this.state.posisi}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  >
    <option value="">Pilih posisi yang dilamar</option>
    {divisions.map((divisi) => (
      <option key={divisi.id} value={divisi.namaPosisi}>
        {divisi.namaPosisi}
      </option>
    ))}
  </select>
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Ratting:</h3>
  <select
    id="ratting"
    name="ratting"
    value={this.state.ratting}
    onChange={this.handleChange}
    required
  >
    <option value="">Pilih Rating</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
  </select>
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Riwayat Pendidikan:</h3>
  <textarea
    name="riwayatPendidikan"
    value={this.state.riwayatPendidikan}
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Pengalaman Kerja:</h3>
  <button type="button" onClick={this.handleTambahPengalaman}>
    Tambah pengalaman kerja
  </button>

  {isAddingPengalaman && (
    <div className="flex flex-col justify-between items-start w-full gap-2">
      <input
        type="text"
        name="namaPengalaman"
        placeholder="Nama Pengalaman"
        value={this.state.namaPengalaman}
        className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
        onChange={(e) =>
          this.handleChangePengalaman(e, "namaPengalaman")
        }
        required
      />
      <textarea
        name="deskripsiPengalaman"
        placeholder="Deskripsi Pengalaman"
        value={this.state.deskripsiPengalaman}
        className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
        onChange={(e) =>
          this.handleChangePengalaman(e, "deskripsiPengalaman")
        }
        required
      />
      <button
        type="button"
        onClick={() => this.handleSubmitPengalaman(null)}
      >
        Simpan
      </button>
    </div>
  )}

  {/* Menampilkan daftar pengalaman kerja */}
  {this.state.pengalamanKerjaList.map((pengalaman, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Nama Pengalaman"
        value={pengalaman.namaPengalaman}
        className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
        onChange={(e) =>
          this.handleChangePengalaman(
            e,
            `pengalamanKerjaList[${index}].namaPengalaman`
          )
        }
        required
      />
      <textarea
        placeholder="Deskripsi Pengalaman"
        value={pengalaman.deskripsiPengalaman}
        className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
        onChange={(e) =>
          this.handleChangePengalaman(
            e,
            `pengalamanKerjaList[${index}].deskripsiPengalaman`
          )
        }
        required
      />
      <button
        type="button"
        onClick={() => this.handleSubmitPengalaman(index)}
      >
        Simpan
      </button>
    </div>
  ))}
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Gaji yang Diharapkan:</h3>
  <input
    type="number"
    name="gajiYangDiharapkan"
    value={this.state.gajiYangDiharapkan}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    onChange={this.handleChange}
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Foto Terbaru:</h3>
  <input
    type="file"
    name="fotoTerbaru"
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">CV Terbaru:</h3>
  <input
    type="file"
    name="cvTerbaru"
    onChange={this.handleChange}
    className="border border-slate-500 rounded-lg bg-slate-700 h-[2.5rem] w-full text-white p-2"
    required
  />
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">
    <input
      type="checkbox"
      name="isJaminanIjazah"
      checked={this.state.isJaminanIjazah}
      onChange={this.handleChange}
    />
    Jaminan Ijazah
  </h3>
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">
    <input
      type="checkbox"
      name="isStrAktif"
      checked={this.state.isStrAktif}
      onChange={this.handleChange}
    />
    STR Aktif
  </h3>
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">
    <input
      type="checkbox"
      name="penempatanCabang"
      checked={this.state.penempatanCabang}
      onChange={this.handleChange}
    />
    Saya bersedia ditempatkan di seluruh cabang kosasih
  </h3>
</div>

<div className="flex flex-col justify-between items-start w-full gap-2">
  <h3 className="text-white font-semibold">Sumber Informasi:</h3>
  <input
    type="text"
    name="sumberInformasi"
    value={this.state.sumberInformasi}
    onChange={this.handleChange}
    required
  />
</div>

{isProses ? (
  <button type="submit" onClick={this.handleSubmit}>
    Mengirim..
  </button>
) : (
 
)}
</div>