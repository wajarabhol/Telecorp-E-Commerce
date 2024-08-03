import React, { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, TextField } from "@mui/material";

// interfaces
import { ProductsInterface } from "../models/IProduct";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ProductCreate() {
    const params = useParams();
    const [products, setProducts] = React.useState<Partial<ProductsInterface>>({
        Name: "", Picture: "", Price: 0, Amount: 0, Sku: "",
    });
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [messages, setMessages] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        if (success === true) {
            window.location.href = "/patient";
        }
        setSuccess(false);
        setError(false);
    };

    // setUser ทำการเก็บข้อมูลจาก textfield ไปเก็บที่ตัวแปร user
    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof ProductCreate;
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
            Price: Number(products.Price),
            Amount: products.Amount,
        };
        if (params.id) {
            data["ID"] = parseInt(params.id);
        }

        console.log(data);

        // หน้าบ้าน จะใช้ JSON สื่อสารกันกับ หลังบ้าน
        // หน้าบ้านจะแนบ header(content-type) และ body(app-json) เพื่อติดต่อไปยังหลังงบ้านที่ method POST
        const apiUrl = "http://localhost:8080/products";
        const requestOptions = {
            method: params.id ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data),
        };

        // หลังบ้านรับ request มา
        // หลังบ้าน check data
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    console.log(res.data);    // ข้อมูลถูกต้อง บันทึกข้อมูลที่หลังบ้านและแสดงข้อมูลที่ console
                    setSuccess(true);       // แสดง pop up การทำงานสำเร็จ
                    setMessages("Successfully!");
                    window.location.href = "/";
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
            {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            <Paper>
                <Box display="flex" sx={{ marginTop: 2, }}>
                    <Box sx={{ paddingX: 2, paddingY: 1 }}>
                        <Grid item xs={10}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                สร้างสินค้า
                            </Typography>
                        </Grid>
                    </Box>
                </Box>
                <Divider />
                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={4}>
                        <p>รหัสสินค้า</p>
                        <FormControl fullWidth>
                            <TextField id="Sku"
                                value={products.Sku}
                                onChange={handleInputChange}
                                label="Sku"
                                variant="outlined" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <p>ชื่อ</p>
                        <FormControl fullWidth>
                            <TextField id="Name"
                                value={products.Name}
                                onChange={handleInputChange}
                                label="Name"
                                variant="outlined" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <p>URL รูป</p>
                        <FormControl fullWidth>
                            <TextField id="Picture"
                                value={products.Picture}
                                onChange={handleInputChange}
                                label="Picture"
                                variant="outlined" />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={4}>
                        <p>ราคา</p>
                        <FormControl fullWidth>
                            <TextField id="Price"
                                value={products.Price}
                                onChange={handleInputChange}
                                label="Price"
                                variant="outlined" />
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            <Paper>
                <Grid container spacing={2}>
                    <Grid item xs={4} sx={{ textAlign: 'right', marginTop: 2, paddingX: 4, paddingY: 1, marginBottom: 2 }}>
                        <Button
                            onClick={submit}
                            variant="contained"
                            color="primary"
                        >
                            บันทึกข้อมูล
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
export default ProductCreate;