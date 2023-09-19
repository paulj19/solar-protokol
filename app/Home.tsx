'use client'

import {BrowserRouter, Route, Routes} from "react-router-dom";
import ClientList from "./ClientList"
import Stats from "./comparison/stats/Stats";
import ComparisonChart from "./comparison/chart/ComparisonChart";
import {CreateClient} from "./CreateClient";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import React, {useState} from "react";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MenuIcon from '@mui/icons-material/Menu';
import {EditOutlined} from "@mui/icons-material";

export function Home() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <BrowserRouter>
                <div className="absolute top-2 right-5">
                    {/*<Button*/}
                    {/*    id="basic-button"*/}
                    {/*    aria-controls={open ? 'basic-menu' : undefined}*/}
                    {/*    aria-haspopup="true"*/}
                    {/*    aria-expanded={open ? 'true' : undefined}*/}
                    {/*    onClick={handleClick}*/}
                    {/*>*/}
                    {/*    Dashboard*/}
                    {/*</Button>*/}
                    {/*<Menu*/}
                    {/*    id="basic-menu"*/}
                    {/*    anchorEl={anchorEl}*/}
                    {/*    open={open}*/}
                    {/*    onClose={handleClose}*/}
                    {/*    MenuListProps={{*/}
                    {/*        'aria-labelledby': 'basic-button',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                    {/*    <MenuItem onClick={handleClose}>My account</MenuItem>*/}
                    {/*    <MenuItem onClick={handleClose}>Logout</MenuItem>*/}
                    {/*</Menu>*/}
                    <Dropdown>
                        <MenuButton
                            variant="outlined" size="sm" className="w-10" startDecorator={<MenuIcon/>}>

                        </MenuButton>
                        <Menu
                            variant="outlined">
                            <MenuItem>CLIENT LIST</MenuItem>
                            <MenuItem>SET PARAMS</MenuItem>
                        </Menu>
                    </Dropdown>
                </div>
                <Routes>
                    <Route path="/" element={<ClientList/>}/>
                    <Route path="/comparisonChart/:clientId" element={<ComparisonChart/>}/>
                    <Route path="/comparisonStats/:clientId" element={<Stats/>}/>
                </Routes>
            </BrowserRouter>
        </LocalizationProvider>
    )
}
