import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import Navbar from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilSquare } from '@fortawesome/free-solid-svg-icons';
import { faPrint, faSearch } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import moment from 'moment';
import '@progress/kendo-theme-material/dist/all.css';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

//ini untuk print
const PrintElement = (props) => {
    const { item } = props;

    return (
        <div className="mt-4">
            <div className="hotel-invoice">
                <h1 className="font-bold">Nota Transaksi</h1>

                <div className="invoice-details">
                    <div>
                        <p><span className="font-semibold">Cafe name:</span> Ichigo</p>
                        <p><span className="font-semibold mt-2">Address:</span> Malang</p>
                        <p><span className="font-semibold mt-2">Phone:</span> 0623-4512</p>
                    </div>
                    <div>
                        <p><span className="font-semibold">Date: </span> {moment(Date.now()).format('DD-MM-YYYY')}</p>
                        <p><span className="font-semibold">Invoice:</span> </p>
                        <span className="mt-1 px-3 py-2 inline-flex text-xl leading-5 font-semibold rounded bg-blue-100 text-blue-800">
                            Transaksi - {item.id_transaksi}
                        </span>
                    </div>
                </div>

                <table className="invoice-items">
                    <thead>
                        <tr>
                            <th className="p-4 text-left">Tanggal Transaksi</th>
                            <th className="p-4 text-center">Nama Pelanggan</th>
                            <th className="p-4 text-center">Nomor Meja</th>
                            <th className="p-4 text-center">Status Pembayaran</th>
                            <th className="p-4 text-center">Nama menu</th>
                            <th className="p-4 text-center">Jumlah</th>
                            <th className="p-4 text-center">Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 text-left">{item.room_type.name_room_type}</td>
                            <td className="p-4 text-center">{item.total_room}</td>
                            <td className="p-4 text-left">{moment(item.check_in_date).format('DD-MM-YYYY')}</td>
                            <td className="p-4 text-left">{moment(item.check_out_date).format('DD-MM-YYYY')}</td>
                            <td className="p-4 text-left">{item.room_type.price}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default class Nota extends React.Component {
    constructor() {
        super()
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
            container: React.createRef(null),
            pdfExportComponent: React.createRef(null),
            isPrint: false
        }

        this.state.id_user = localStorage.getItem("id")
        if (localStorage.getItem("token")) {
            if (
                localStorage.getItem("role") === "kasir"
            ) {
                this.state.token = localStorage.getItem("token");
                this.state.role = localStorage.getItem("role");
            } else {
                window.alert("You must register or login as kasir!");
            }
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getTransaksi = () => {
        let url = "http://localhost:8080/transaksi" + this.state.id_user
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    transaksi: response.data.data
                })
                console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    _handleFilter = () => {
        let data = {
            keyword: this.state.keyword,
        }
        let url = "http://localhost:8080/transaksi/find" + this.state.id_transaksi;
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        transaksi: response.data.data
                    })
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
            })
    }

    checkRole = () => {
        if (this.state.role !== "kasir") {
            localStorage.clear()
            window.alert("You must register or login as kasir !")
        }
    }

    handlePrint = (item) => {
        let element = this.state.container.current;

        this.setState({
            dataPrint: item,
            isPrint: true
        })

        setTimeout(() => {
            savePDF(element, {
                fileName: `invoice-${item.transaksi_number}`
            })
            this.setState({
                isPrint: false
            })
        }, 500)
    }

    componentDidMount() {
        this.getTransaksi()
        this.checkRole()
    }

    render() {
        return (
            <div>
                <Navbar />

                <div className="m-6 pl-6">
                    <p className="text-xl font-semibold text-blue-600">History </p>
                    <p className="text-5xl font-bold mt-2">Transaction List</p>
                    <div className="flex mt-6">
                        <div className="flex rounded w-1/2">
                            <input
                                type="text"
                                className="w-5/6 block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                placeholder="Search..."
                                name="keyword"
                                value={this.state.keyword}
                                onChange={this.handleChange}
                            />
                            <button className="w-1/6 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={this._handleFilter}>
                                <FontAwesomeIcon icon={faSearch} size="" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-2 ml-12 mr-8">
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
                                                ID Transaksi
                                            </th>
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
                                                ID Meja
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                ID User
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Tanggal Transaksi
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
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Print
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {this.state.transaksi.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.nama_pelanggan}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.id_meja}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {item.id_user}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {moment(item.tgl_transaksi).format('DD-MM-YYYY')}

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
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="hidden-on-narrow"
                >
                    <PDFExport ref={this.state.pdfExportComponent}>
                        <div ref={this.state.container}>
                            {this.state.isPrint ? <PrintElement item={this.state.dataPrint}/> : null}
                        </div>
                    </PDFExport>
                </div>
            </div >
        )
    }

}