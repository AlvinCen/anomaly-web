import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
// import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import api from '../axiosInstance';
// import { firestore } from '../Firebase';

const CategoryFilter = ({ setSelectedCategory }) => {
  const [data, setData] = useState([]);
  const [init, setInit] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false)


  // useEffect(() => {
  //   const unsubscribeInit = onSnapshot(query(collection(firestore, "menuCategory"), orderBy("label", "asc")), { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (!init) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       });
  //       setData(tmpData);
  //       setInit(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(query(collection(firestore, "menuCategory"), orderBy("label", "asc")), async (snapshot) => {
  //     // var tmpData = [...data];

  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (init) {
  //       {
  //         snapshot.forEach((tmpDocs) => {
  //           // console.log(tmpDocs.id)  
  //           const docData =
  //           {
  //             ...tmpDocs.data(),
  //             id: tmpDocs.id,
  //           };
  //           tmpData.push(docData);
  //         });
  //         console.log(tmpData)
  //         setData(tmpData);
  //       }
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [init]);
  // Fungsi untuk mengambil data menu report
  const fetchMenuCategory = async () => {
    (true);
    try {
      const response = await api.post('/data', {
        collection: "menuCategory",
        filter: {},
        sort: { label: 1 }
      })
      setData(response.data);
      setInit(true);
    } catch (error) {
      console.error('Error fetching menu reports:', error);
      // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
    } finally {
      (false);
    }
  };
  // Update useEffect hooks
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchMenuCategory();
      setLoadingInit(false);
    };

    if (!loadingInit) {
      loadInitialData();
    }
  }, [loadingInit]);

  return (
    <div className="category-filter mb-3">
      <CButton
        key={'all'}
        className='mx-1 my-1'
        color="secondary"
        onClick={() => setSelectedCategory('all')}
      >All</CButton>
      {data.map(category => (
        <CButton
          key={category.label}
          className='mx-1 my-1'
          color="secondary"
          onClick={() => setSelectedCategory(category.value)}
        >
          {category.label}
        </CButton>
      ))}
    </div>
  );
};

export default CategoryFilter;
