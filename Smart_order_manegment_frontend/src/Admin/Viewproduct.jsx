import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard ";
import Box from "@mui/material/Box";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import axios from "axios";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TableFooter from "@mui/material/TableFooter";
import Swal from "sweetalert2";
export default function Viewproduct() {
  const [product, setproduct] = useState([]);
  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);
  const [serch, setserch] = useState("");

  const handlpagechange = (e, new_page) => {
    setpage(new_page);
  };

  const handlrowpagechange = (e) => {
    setrowperpage(Number(e.target.value));
    setpage(0);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5600/view/product/admin/viewdeta`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setproduct(res.data.data);
        // console.log(res.data.data);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);

  const [order, setorder] = useState("asc");
  const naviagate = useNavigate();
  const handlclickofedit = (id) => {
    naviagate(`/admin/edit-product/${id}`);
  };

  const handlsort = (field) => {
    const sort = [...product].sort((a, b) => {
      if (order == "asc") {
        return a[field] < b[field] ? -1 : 1;
      } else {
        return a[field] > b[field] ? -1 : 1;
      }
    });
    setproduct(sort);
    setorder(order === "asc" ? "desc" : "asc");
  };

  const HandlDeleteButton = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5600/view/delete-product/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: res.data.message || "Product deleted successfully.",
              icon: "success",
            });

            setproduct((prev) => prev.filter((item) => item._id !== id));
          })
          .catch((er) => {
            Swal.fire({
              title: "Error!",
              text:
                er.response?.data?.message ||
                "Something went wrong while deleting product.",
              icon: "error",
            });
          });
      }
    });
  };
  return (
    <>
      <AdminDashboard />

      <Box
        sx={{
          background: "#f5f7fb",
          minHeight: "100vh",
          pt: 10,
          px: { xs: 2, sm: 3, md: 5 },
          pb: 4,
        }}
      >
        {/* page heading */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
            alignItems: "center",
            width: "100%",
            gap: 3,
          }}
        >
          {/* Left Side */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 55,
                height: 55,
                bgcolor: "#e0eaff",
                color: "#2563eb",
                flexShrink: 0,
              }}
            >
              <ShoppingBagIcon />
            </Avatar>

            <Box>
              <Typography variant="h4">Product View</Typography>
              <Typography variant="body2">Manage All Products</Typography>
            </Box>
          </Stack>

          {/* Right Side */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            sx={{
              justifySelf: { xs: "stretch", md: "end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              label="Search Products"
              name="search"
              value={serch}
              onChange={(e) => {
                setserch(e.target.value);
                setpage(0);
              }}
              sx={{ width: { xs: "100%", md: 320 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ whiteSpace: "nowrap" }}
              onClick={() => {
                naviagate("/admin/add-product");
              }}
            >
              ADD PRODUCT
            </Button>
          </Stack>
        </Stack>

        {/* table container */}
        <TableContainer>
          <Table sx={{ mt: 1 }}>
            <TableHead>
              <TableRow sx={{ background: "#eff4ff" }}>
                {[
                  "SR NO.",
                  "IMAGE",
                  "NAME",
                  "PRICE",
                  "STOCK",
                  "SKU",
                  "ACTIONS",
                ].map((heading) => (
                  <TableCell
                    onClick={() =>
                      handlsort(
                        heading === "NAME"
                          ? "productName"
                          : heading === "PRICE"
                            ? "price"
                            : heading === "STOCK"
                              ? "stock"
                              : heading === "SKU"
                                ? "sku"
                                : "",
                      )
                    }
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                      py: 2.5,
                      fontSize: 13,
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {product
                .filter(
                  (row) =>
                    row.productName
                      .toLowerCase()
                      .includes(serch.toLowerCase()) ||
                    row.sku.toLowerCase().includes(serch.toLowerCase()) ||
                    row.price
                      .toString()
                      .toLowerCase()
                      .includes(serch.toLowerCase()) ||
                    row.stock
                      .toString()
                      .toLowerCase()
                      .includes(serch.toLowerCase()),
                )
                .slice(page * rowperpage, rowperpage * page + rowperpage)
                .map((er, index) => (
                  <TableRow
                    key={er._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8faff",
                      },
                      "& td": {
                        borderBottom: "1px solid #edf0f5",
                        py: 2,
                      },
                    }}
                  >
                    <TableCell>{page * rowperpage + index + 1}</TableCell>
                    <TableCell>
                      <img
                        src={`http://localhost:5600${er.productImage}`}
                        alt={product.productName}
                        width="60"
                      />
                    </TableCell>

                    <TableCell>{er.productName}</TableCell>
                    <TableCell>{er.price}</TableCell>
                    <TableCell>{er.stock}</TableCell>
                    <TableCell>{er.sku}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            onClick={() => handlclickofedit(er._id)}
                            sx={{
                              bgcolor: "#e0ecff",
                              color: "#2563eb",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#bfdbfe",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete User">
                          <IconButton
                            onClick={() => HandlDeleteButton(er._id)}
                            sx={{
                              bgcolor: "#fee2e2",
                              color: "#dc2626",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#fecaca",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  count={product.length}
                  page={page}
                  rowsPerPageOptions={[5, 10, 25]}
                  rowsPerPage={rowperpage}
                  onPageChange={handlpagechange}
                  onRowsPerPageChange={handlrowpagechange}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
