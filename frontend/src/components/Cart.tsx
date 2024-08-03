import React, { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CartsInterface } from "../models/IProduct";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

function Carts() {
  const [carts, setCarts] = React.useState<CartsInterface[]>([]);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState<boolean[]>([]);
  const params = useParams();

  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  function CalcTotalPrice(info: CartsInterface[]) {
    let totalPrice = 0
    info.forEach((info: CartsInterface) => {
      totalPrice += (info.Amount * info.Product.Price)
    })
    return totalPrice
  }

  const getCarts = async () => {
    // const getCarts = async (id: string) => {
    const apiUrl = "http://localhost:8080/carts";
    // const apiUrl = `http://localhost:8080/products/${id}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`    // login เพื่อเอาข้อมูลให้หลังบ้าน check เป็นการระบุตัวตน
      },
    };

    // หลังบ้าน check token และ ข้อมูล
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.data) {
          setCarts(res.data);  // ข้อมูลถูกต้อง หลังบ้านจะส่งข้อมูลมาตามที่ขอ
          // res.data.forEach((info: CartsInterface) => {
          //   setTotalPrice(totalPrice + (info.Amount * info.Product.Price))
          // })
        }
        else {
          console.log(res.error);  // ข้อมูลไม่ถูกต้อง จะแสดงค่า error ที่ console เช่น token หรือ ข้อมูลไม่ถูกต้อง ก็จะแสดงค่าของข้อมูลตัวนั้น
        }
      });
    console.log(carts);
  };

  const deleteProduct = async (id: number) => {
    const apiUrl = `http://localhost:8080/products/${id}`;
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.data) {
          setSuccess(true);
          setMessage("Delete Success");
          console.log(res.data);
        }
        else {
          setError(true);
          setMessage("Delete Error");
          console.log(res.error);
        }
      });
    window.location.reload();
    handleCloseDialog(id);
  }

  const checkOpen = (id: number): boolean => {
    return open[id] ? open[id] : false;
  }

  const handleOpen = (id: number) => {
    let openArr = [...open];
    openArr[id] = true;
    setOpen(openArr);
  };

  const handleCloseDialog = (id: number) => {
    let openArr = [...open];
    openArr[id] = false;
    setOpen(openArr);
  };

  const columns: GridColDef[] = [
    {
      field: "Product",
      headerName: "สินค้า",
      width: 250,
      valueGetter: (params) => { return params.row.Product.Name },
    },
    {
      field: "Price",
      headerName: "ราคา",
      width: 80,
      valueGetter: (params) => params.row.Product.Price,
    },
    {
      field: "Amount",
      headerName: "จำนวน",
      width: 80,
      valueGetter: (params) => params.row.Amount,
    },
    {
      field: "TotalPrice",
      headerName: "ยอดรวม",
      width: 80,
      valueGetter: (params) => params.row.Amount * params.row.Product.Price,
    },
  ];

  useEffect(() => {
    getCarts();
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     getCarts(params.id)
  //   }
  // }, []);

  return (
    <div>
      <Container maxWidth="lg">
        <FormControl sx={{ m: 1, minWidth: 505 }}>
          <div style={{ height: 300, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={carts}
              getRowId={(row) => row.ID}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
          <FormControl fullWidth >
            <p>ยอดรวมทั้งหมด </p>
            <OutlinedInput
              id="outlined-adornment-amount"
              endAdornment={<InputAdornment position="end">฿</InputAdornment>}
              disabled
              value={CalcTotalPrice(carts)}
            />
          </FormControl>
          <Button size="small" component={RouterLink} to="/">ดูสินค้าเพิ่มเติม</Button>
        </FormControl>
      </Container>
    </div>
  );
}
export default Carts;