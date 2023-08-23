import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import "@progress/kendo-theme-material/dist/all.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import TextPoppins from "../Components/TextPoppins";
import { Table, Tbody, Tr, Td, Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencilSquare,
  faSearch,
  faTasks,
  faPrint
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import $ from "jquery";
import moment from "moment";

const PrintElement = (props) => {
  const { item } = props;

  return (
    <Box w={"100vw"} h={"100vh"}>
      <Table variant="simple" maxW={"100%"} mx={"auto"}>
        <Tbody>
          <Tr>
            <Td colSpan={2} textAlign={"center"}>
              <TextPoppins
                text={`Cetak Pemesanan`}
                fontSize={"md"}
                fontWeight={600}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins text={"Nama:"} fontSize={"md"} fontWeight={400} />
            </Td>
            <Td>{item.nama_pelanggan}</Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins text={`Tanggal Transaksi`} fontSize={"md"} fontWeight={400} />
            </Td>
            <Td>{new Date(item.tgl_transaksi).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins
                text={"Nama menu:"}
                fontSize={"md"}
                fontWeight={400}
              />
            </Td>
            <Td>{item.nama_menu}</Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins
                text={"Total Harga:"}
                fontSize={"md"}
                fontWeight={400}
              />
            </Td>
            <Td>
              {item.harga}
            </Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins
                text={"Status:"}
                fontSize={"md"}
                fontWeight={400}
              />
            </Td>
            <Td>
              {item.status}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default class HistoryTransaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      transaksi: [],
      menu: [],
      mejaa: [],
      user: [],
      id_transaksi: "",
      id_user: "",
      id_menu: "",
      id_meja: "",
      nama_pelanggan: "",
      nomor_meja: "",
      nama_user: "",
      harga: "",
      tgl_transaksi: "",
      status: "",
      status_meja: "",
      role: "",
      token: "",
      action: "",
      keyword: "",
      dataPrint: {},
      container: React.createRef(null),
      pdfExportComponent: React.createRef(null),
      isPrint: false
    };

    if (localStorage.getItem("token")) {
      if (
        localStorage.getItem("role") === "admin" ||
        localStorage.getItem("role") === "kasir" ||
        localStorage.getItem("role") === "manajer"
      ) {
        this.state.token = localStorage.getItem("token");
        this.state.role = localStorage.getItem("role");
      } else {
        window.alert("You're not admin or kasir!");
        window.location = "/";
      }
    }
  }

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    $("#modal_Transaksi").hide();
  };
  handleCloseEdit = () => {
    $("#modal_edit").hide();
  }
  handleEditStatus = (item) => {
    $("#modal_edit").show();
    this.setState({
      id_transaksi: item.id_transaksi,
      status: item.status,
      action: "update",
    });
  };
handleAddTransaksi = () => {
  let form = {
    id_transaksi: this.state.id_transaksi,
    status: this.state.status,
    id_meja: this.state.id_meja,
    id_user: this.state.id_user,
    detail_transaksi:[{
      id_menu: this.state.id_menu,
      harga: this.state.harga,
      qty: this.state.qty,
    }],
    nama_menu: this.state.nama_menu,
    nama_pelanggan: this.state.nama_pelanggan,
    nomor_meja: this.state.nomor_meja,
    nama_user: this.state.nama_user,
  };
        let url = "http://localhost:8080/transaksi "
        axios.post(url, form, this.headerConfig())
            .then(response => {
                this.getTransaksi()
                this.handleClose()
                window.location = "/historytransaksi"
            })
            .catch(error => {
                console.log("error add data", error)
                if (error.response.status === 500 || error.response.status === 404) {
                    window.alert("Failed Transaksi room");
                }
            })
    }
  handleAdd = (item) => {
    $("#modal_Transaksi").show();
    this.setState({
      // id_transaksi: item.id_transaksi,
      // status: item.status,
      // id_meja: item.id_meja,
      // id_user: item.id_user,
      // id_menu: item.id_menu,
      // nama_pelanggan: item.nama_pelanggan,
      // nomor_meja: item.nomor_meja,
      // nama_user: item.nama_user,
      // harga: item.harga,
      action: "insert",
    });
  };

  handleSave = (e) => {
    e.preventDefault();

    let form = {
      id_transaksi: this.state.id_transaksi,
      status: this.state.status,
      id_meja: this.state.id_meja,
      id_user: this.state.id_user,
      id_menu: this.state.id_menu,
      nama_pelanggan: this.state.nama_pelanggan,
      nomor_meja: this.state.nomor_meja,
      nama_user: this.state.nama_user,
      harga: this.state.harga,
    };
    let formedit = {
      id_transaksi: this.state.id_transaksi,
      status: this.state.status,
    };
    if (this.state.action === "insert") {
      let url = "http://localhost:8080/transaksi"
      axios.post(url, form,this.headerConfig())
          .then(response => {
              this.getUser()
              this.getTransaksi();
              this.handleClose()
          })
          .catch(error => {
              console.log("error add data", error.response.status)
              if (error.response.status === 500) {
                  window.alert("Failed to add data");
              }
          })
  } else {
      let url = "http://localhost:8080/transaksi/" + this.state.id_transaksi;
      axios
        .put(url, formedit, this.headerConfig())
        .then((response) => {
          this.getTransaksi();
        //   this.getTypeRoom();
          this.getUser();
          this.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  _handleFilter = () => {
    let data = {
      keyword: this.state.keyword,
  }
    let url = "http://localhost:8080/transaksi/find";
    axios
      .post(url, data,this.headerConfig())
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            transaksi: response.data.data,
          });
        } else {
          alert(response.data.message);
          this.setState({ message: response.data.message });
        }
      })
      .catch((error) => {
        console.log("error", error.response.status);
      });
  };

  handlePrint = (item) => {
    let element = this.state.container.current;

    this.setState({
      dataPrint: item,
      isPrint: true
    })

    setTimeout(() => {
      savePDF(element, {
        fileName: `invoice-${item.id_transaksi}`
      })
      this.setState({
        isPrint: false
      })
    }, 500)
  }

//   handlePrint = (item) => {
//     let element = this.state.container.current;

//     this.setState({
//         dataPrint: item,
//         isPrint: true
//     })

//     setTimeout(() => {
//         savePDF(element, {
//             fileName: `invoice-${item.transaksi_number}`
//         })
//         this.setState({
//             isPrint: false
//         })
//     }, 500)
// };


  getTransaksi = () => {
    let url = "http://localhost:8080/transaksi";

    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          transaksi: response.data.data,
        });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkRole = () => {
    if (this.state.role !== "admin" && this.state.role !== "kasir" && this.state.role !== "manajer") {
      localStorage.clear();
      window.alert("You're not admin or kasir!");
      window.location = "/";
    }
  };

  componentDidMount() {
    this.getTransaksi();
    // this.getTypeRoom();
    // this.getUser();
    this.checkRole();
  }

  render() {
    return (
      <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
          <Header />
          <div class="main-content flex flex-col flex-grow p-4">
            <h1 class="font-bold text-xl text-black-700">
              Daftar History Transaksi Customer
            </h1>

            <div className="flex mt-2 flex-row-reverse">
              <div className="flex rounded w-1/3 mr-4">
                <input
                  type="text"
                  className="w-2/3 block w-full px-4 py-2 bg-white border rounded-md focus:border-yellow-400 focus:ring-yellow-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                  placeholder="Search..."
                  name="keyword"
                  value={this.state.keyword}
                  onChange={this.handleChange}
                />
                <button
                  className="w-1/3 ml-2 px-4 text-white bg-yellow-600 rounded hover:bg-yellow-700" onClick={this._handleFilter} ><FontAwesomeIcon icon={faSearch} size="" />
                </button>
                {this.state.role === "kasir" && (
                  <button
                 className="w-1/3 ml-2 px-4 text-white bg-yellow-600 rounded hover:bg-yellow-700" onClick={() => this.handleAdd()}><FontAwesomeIcon icon={faPlus} size="" /> Add
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-2 mr-4">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            id transaksi
                          </th>
                          {/* <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nama User
                          </th> */}
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nama pelanggan
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            nama menu
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            harga
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tanggal transaksi
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aksi
                            </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* {console.log(this.state.transaksi)} */}
                        {Array.isArray(this.state.transaksi) &&
                          this.state.transaksi.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{index + 1}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {item.nama_pelanggan}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {item.nama_menu}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {item.harga}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {moment(item.tgl_transaksi).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {item.status === "belum_bayar" && (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                      {item.status}
                                    </span>
                                  )}
                                  {item.status === "lunas" && (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      {item.status}
                                    </span>
                                  )}
                                </td>
                                {this.state.role === "kasir" && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      className={`bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2 ${
                                        item.status === ""
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        this.handleEditStatus(item)
                                      }
                                      disabled={
                                        item.status === ""
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faPencilSquare}
                                        size="lg"
                                      />
                                    </button>
                                   
                                  </td>

                                )}
                                {this.state.role === "manajer" && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.handlePrint(item)}>
                                      <FontAwesomeIcon icon={faPrint} size="lg" />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="footer px-4 py-2">
            <div class="footer-content">
              <p class="text-sm text-gray-600 text-center">
                © Brandname 2023. All rights reserved.
              </p>
            </div>
          </footer>
        </main>

        {/* Modal Form */}
        <div id="modal_Transaksi" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
          <div class="flex lg:h-auto w-auto justify-center ">
            <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Tutup modal</span>
              </button>
              <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                  Edit Status Transaksi{" "}
                </h3>
                <form class="space-y-6" onSubmit={(event) => this.handleAddTransaksi(event)}>
                <div>
                      <label for="nama_pelanggan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama pelanggan</label>
                      <input type="text" name="nama_pelanggan" id="nama_pelanggan"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan nama pelanggan" required />
                  </div>
                  <div>
                      <label for="id_meja" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">id meja</label>
                      <input type="text" name="id_meja" id="id_meja"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan id meja" required />
                  </div>
                  <div>
                      <label for="id_user" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">id user</label>
                      <input type="text" name="id_user" id="id_user"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan id user" required />
                  </div>
                  <div>
                      <label for="id_menu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">id menu</label>
                      <input type="text" name="id_menu" id="id_menu"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan id menu" required />
                  </div>
                  <div>
                      <label for="nomor_meja" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nomor meja</label>
                      <input type="text" name="nomor_meja" id="nomor_meja"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan nomor meja" required />
                  </div>
                  <div>
                      <label for="nama_user" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama user</label>
                      <input type="text" name="nama_user" id="nama_user"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan nama user" required />
                  </div>
                  <div>
                                        <label for="nama_menu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama menu</label>
                                        <input type="text" name="nama_menu" id="nama_menu"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan nama menu " required />
                                    </div>
                  <div>
                                        <label for="harga" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">harga</label>
                                        <input type="number" name="harga" id="harga"  onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan harga " required />
                                    </div>
                  <div>
                    <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">
                      Status
                    </label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Pilihan status" name="status" value={this.state.status} onChange={this.handleChange} required>
                      <option value="">Pilih Status</option>
                      <option value="belum_bayar">belum_bayar</option>
                      <option value="lunas">lunas</option>
                    </select>
                  </div>
                  <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modal edit */}
        <div
          id="modal_edit"
          tabindex="-1"
          aria-hidden="true"
          class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div class="flex lg:h-auto w-auto justify-center ">
            <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => this.handleCloseEdit()}
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Tutup modal</span>
              </button>
              <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                  Edit Status Transaksi{" "}
                </h3>
                <form
                  class="space-y-6"
                  onSubmit={(event) => this.handleSave(event)}
                >
                  <div>
                    <label
                      for="status"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Status
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="Pilihan status"
                      name="status"
                      value={this.state.status}
                      onChange={this.handleChange}
                      required
                    >
                      <option value="">Pilih Status</option>
                      <option value="belum_bayar">belum bayar</option>
                      <option value="lunas">lunas</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    class="w-full text-white bg-gradient-to-br from-purple-600 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="hidden-on-narrow"
        >
          <PDFExport ref={this.state.pdfExportComponent}>
            <div ref={this.state.container}>
              {this.state.isPrint ? <PrintElement item={this.state.dataPrint} /> : null}
            </div>
          </PDFExport>
        </div>
      </div>
    );
  }
}