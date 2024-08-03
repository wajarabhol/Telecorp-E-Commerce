import React, { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, CardContent, CardMedia, TextField } from "@mui/material";

// interfaces
import { ProductsInterface } from "../models/IProduct";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ProductShow() {
  const params = useParams();
  const [products, setProducts] = React.useState<Partial<ProductsInterface>>({
    Sku: "", Name: "", Picture: "", Price: 0, Amount: 0,
  });
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [messages, setMessages] = React.useState("");

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    if (success === true) {
      window.location.href = "/carts";
    }
    setSuccess(false);
    setError(false);
  };

  // setUser ทำการเก็บข้อมูลจาก textfield ไปเก็บที่ตัวแปร user
  const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
    const id = event.target.id as keyof typeof ProductShow;
    const { value } = event.target;
    setProducts({ ...products, [id]: value });
  };

  const getProduct = async (id: string) => {
    const apiUrl = `http://localhost:8080/product/${id}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        } else {
          console.log(res.error);
        }
      });
  }

  function submit() {
    // ตัวแปร data เป็นตัวรับข้อมูลจากตัวแปร user เพื่อส่งไปหลังบ้าน
    let data: any = {
      Sku: products.Sku ?? "",
      Name: products.Name ?? "",
      Picture: products.Picture ?? "",
      Price: products.Price,
      Amount: Number(products.Amount),
    };
    if (params.id) {
      data["ProductID"] = parseInt(params.id);
    }

    console.log(data);

    const apiUrl = "http://localhost:8080/carts";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log(res.data);    // ข้อมูลถูกต้อง บันทึกข้อมูลที่หลังบ้านและแสดงข้อมูลที่ console
          setSuccess(true);       // แสดง pop up การทำงานสำเร็จ
          setMessages("Successfully!");
          window.location.href = "/carts";
          // loginRegisted();      // เป็นการ login เข้าระบบแบบ auto
        } else {
          setError(true);       // ข้อมูลไม่ถูกต้อง แสดง pop up การทำงานไม่สำเร็จ
          setMessages("Fail! " + res.error);
          console.log(res.error); // ข้อมูลไม่ถูกต้อง จะแสดงค่า error ที่ console
        }
      });
  }

  useEffect(() => {
    if (params.id) {
      getProduct(params.id)
    }
  }, []);
  useEffect(() => {
  }, [products]);

  console.log(products);

  return (
    <Container maxWidth="md">
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          {messages}
        </Alert>
      </Snackbar>
      <Snackbar open={error}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {messages}
        </Alert>
      </Snackbar>
      <Divider />
      <Box flexGrow={1} sx={{ boxShadow: 10, mt: 5, borderRadius: 1 }}>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={9}>
            <CardMedia
              component="img"
              alt={products.Name}
              height="500"
              image={products.Picture}
            />
          </Grid>
          <Grid item xs={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {products.Sku}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {products.Name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {products.Price}
              </Typography>
            </CardContent>
            <Grid item xs={4}>
              <p>จำนวน</p>
              <FormControl fullWidth>
                <TextField id="Amount"
                  value={products.Amount}
                  onChange={handleInputChange}
                  label="Amount"
                  variant="outlined" />
                <Button
                  onClick={submit}
                  variant="contained"
                  color="primary"
                >
                  บันทึก
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
export default ProductShow;