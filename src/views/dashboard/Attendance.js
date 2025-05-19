import React, { useEffect, useState } from 'react';
// import { firestore, storage } from '../../Firebase'; // Import your Firebase configuration
import { collection, addDoc, serverTimestamp, query, orderBy, where, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../AuthContext.js';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CForm,
    CFormLabel,
    CFormInput,
    CButton,
    CRow,
    CAlert,
    CInputGroup,
    CSpinner,
} from '@coreui/react';
import AppTable from '../../components/AppTable';
import Swal from 'sweetalert2';
import moment from 'moment';
import Loading from '../../components/Loading';
import axios from 'axios';
import api from '../../axiosInstance.js';
import Cashier from './Cashier.js';

const Attendance = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);


    const [refresh, setRefresh] = useState(false)
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const [init, setInit] = useState(false)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        const formData = new FormData()
        formData.append('foto', photo)

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // ini boleh diisi di axios
                },
            })
            console.log(response.data)
            if (response.data) return response.data.url
        } catch (err) {
            console.error(err)
            //   alert("Upload gagal")
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const now = moment();
        const limitTime = new Date();
        // if (currentUser?.role === "admin-pool") {
        //     limitTime.setHours(11, 40, 0, 0);
        // }
        // else if (currentUser?.role === "admin-cafe") {
        //     limitTime.setHours(10, 40, 0, 0);
        // }
        limitTime.setHours(11, 40, 0, 0);
        // if (!photo) {
        //     setError('Harap ambil foto untuk absensi.');
        //     return;
        // }

        try {
            const photoURL = await handleUpload()
            // console.log(currentUser)
            await api.post("/data/add", {
                collection: "attendance",
                data: {
                    userId: currentUser?._id,
                    photoURL: photo ? photoURL : "",
                    createdAt: moment().format().toString(),
                    late: now.diff(moment(limitTime)) > 0,
                    status: "CHECK-IN"
                }
            });


            if (now > limitTime) {
                setError('Waktu absensi sudah lewat.');
            } else {
                setError('');
            }

            setPhoto(null);
            // setError('');
            Swal.fire({
                title: "Success!",
                text: "Berhasil absensi",
                icon: "success"
            });
        } catch (err) {
            console.log(err)
            setError('Gagal melakukan absensi.');
            Swal.fire({
                title: "Failed!",
                text: "Gagal absensi",
                icon: "error"
            });
        }
        setRefresh(!refresh)
        setPhoto(null)
        setLoading(false)
    };

    const checkOut = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            await api.put("/data/update", {
                collection: "attendance",
                filter: { _id: data[data?.lastIndex]?._id },
                update: {
                    time_out: moment().format().toString(),
                    status: "CHECK-OUT"
                }
            });

            Swal.fire({
                title: "Success!",
                text: "Berhasil checkout",
                icon: "success"
            });
        } catch (err) {
            console.log(err)
            setError('Gagal melakukan checkout.');
            Swal.fire({
                title: "Failed!",
                text: "Gagal checkout",
                icon: "error"
            });
        }
        setRefresh(!refresh)
        setLoading(false)
    };

    return (
        <CRow>
            <CCol xs>
                <Cashier />

                {error && <CAlert color="danger">{error}</CAlert>}

                <CCard className="mb-4">
                    <CCardHeader><b>Form Kehadiran</b></CCardHeader>
                    <CCardBody>
                        {data[data?.lastIndex]?.status !== "CHECK-IN" ?
                            <CForm onSubmit={handleSubmit}>
                                <CFormInput
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handlePhotoChange}
                                />
                                {!loading ?
                                    <CButton type="submit" className='float-end mt-3' color="primary">
                                        Check In
                                    </CButton>
                                    : <CSpinner color="primary" className="float-end" variant="grow" />}

                            </CForm> :
                            (!loading ?
                                <CButton className="w-100" color="danger" onClick={checkOut}>
                                    Check Out
                                </CButton>
                                : <CSpinner color="primary" className="float-end" variant="grow" />)}
                    </CCardBody>
                </CCard>
                <AppTable
                    title={"Daftar Kehadiran"}
                    column={[
                        { name: "#", key: "index" },
                        { name: "Tanggal", key: "createdAt" },
                        { name: "Jam Masuk", key: "time_in" },
                        { name: "Jam Keluar", key: "time_out" },
                    ]}
                    collection={"attendance"} // Ambil data dari koleksi "cashiers"
                    filter={{}} // Bisa diberikan filter
                    sort={{ createdAt: -1 }} // Sortir dari terbaru
                    refresh={refresh}
                    setParentData={setData}
                />

            </CCol>
        </CRow >
    );
}

export default Attendance;