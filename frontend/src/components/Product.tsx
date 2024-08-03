import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ProductsInterface } from "../models/IProduct";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { CardMedia, CardContent, CardActions, Grid, Icon, Divider, TextField } from "@mui/material";

function Products() {
  const [products, setProducts] = React.useState<ProductsInterface[]>([]);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState<boolean[]>([]);

  const [sku, setSku] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");

  const getProducts = async (criteria?: { name?: string, sku?: string }) => {
    // ex. http://localhost:8080/products?name=Acer
    const apiUrl = "http://localhost:8080/products?"
      + new URLSearchParams({ name: criteria?.name ?? "", sku: criteria?.sku ?? "" });

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
          setProducts(res.data);  // ข้อมูลถูกต้อง หลังบ้านจะส่งข้อมูลมาตามที่ขอ
        }
        else {
          console.log(res.error);  // ข้อมูลไม่ถูกต้อง จะแสดงค่า error ที่ console เช่น token หรือ ข้อมูลไม่ถูกต้อง ก็จะแสดงค่าของข้อมูลตัวนั้น
        }
      });
    console.log(products);
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

  const handleSearch = async () => {
    await getProducts({ name: name, sku: sku });
  }

  const handleClear = () => {
    setSku("");
    setName("");
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

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <Container maxWidth="lg">
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1} sx={{ padding: 2, boxShadow: 10, borderRadius: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              สินค้า
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <TextField
            id="outlined-search"
            label="รหัส"
            type="search"
            sx={{
              marginRight: 2,
            }}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <TextField
            id="outlined-search"
            label="ชื่อ"
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <React.Fragment>
            <IconButton size="small" onClick={() => handleSearch()}>
              <SearchIcon color="success" fontSize="small"></SearchIcon>
            </IconButton>
            <IconButton size="small" onClick={() => handleClear()}>
              <DeleteIcon color="error" fontSize="small"></DeleteIcon>
            </IconButton>
          </React.Fragment>
        </Box>
        <Box flexGrow={1} sx={{
          boxShadow: 10, mt: 5, borderRadius: 1
        }}>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <Icon color="primary" sx={{ fontSize: 30 }} component={RouterLink} to={"/productcreate"}>add_circle</Icon>
          <Divider />
          <Box style={{ maxHeight: '68vh', overflow: 'auto' }}>
            <Grid container spacing={2}>
              {products.map((data: ProductsInterface) => {
                return (
                  <Grid item xs={3} sx={{ display: 'block', boxShadow: 5 }}>
                    <React.Fragment>
                      <IconButton size="small" component={RouterLink} to={`/productcreate/${data.ID}`}>
                        <EditIcon color="success" fontSize="small"></EditIcon>
                      </IconButton>
                      <IconButton size="small" onClick={() => deleteProduct(data.ID)}>
                        <DeleteIcon color="error" fontSize="small"></DeleteIcon>
                      </IconButton>
                    </React.Fragment>
                    <CardMedia
                      component="img"
                      alt={data.Name}
                      height="300"
                      image={data.Picture}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {data.Sku}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {data.Name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.Price + " ฿"}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" component={RouterLink} to={`/productshow/${data.ID}`}>รายละเอียดเพิ่มเติม</Button>
                    </CardActions>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </Box>
        <Button size="small" component={RouterLink} to="/carts">ดูตะกร้า</Button>
      </Container>
    </div>
  );
}
export default Products;