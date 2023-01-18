import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button, Container } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid2 from '@mui/material/Unstable_Grid2';

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    chooseImage: (value: string) => void;
}

interface Images {
    _id: string;
    filename: string;
    contentType: string;
    chunkSize: number;
    length: number;
    uploadDate: Date;
}

const PDFImageTable: React.FC<Props> = ({ isOpen, setIsOpen, chooseImage }) => {
    const [images, setImages] = useState<Images[]>([])

    useEffect(() => {
        if (!isOpen) return;
        fetch('http://localhost:5000/files/get_files?currentUserId=63bbb27d01e8d1f6e35f51ca', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
            }
        })
            .then((response) => response.json())
            .then((res) => setImages(res))
        return () => {
            setImages([]);
        }
    }, [isOpen])

    const handleClick = () => {
        setIsOpen(!isOpen);
        console.log(images)
    }

    const downloadImage = (id: string, filename: string) => {
        let a = document.createElement('a');
        a.href = `http://localhost:5000/files/get_image_by_id?_id=${id}&auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc&currentUserId=63bbb27d01e8d1f6e35f51ca`;
        a.click();
    }

    const handleFileChange = (e: React.FormEvent) => {
        const target = e?.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        if (!file) return;
        let formData = new FormData();
        formData.append('image', file)

        fetch('http://localhost:5000/files/upload?currentUserId=63bbb27d01e8d1f6e35f51ca', {
            method: "POST",
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                setImages(prevState => [...prevState, { _id: res.file.id, filename: res.file.filename, contentType: res.file.contentType, chunkSize: res.file.chunkSize, length: res.file.length, uploadDate: res.file.uploadDate }])
            })
    }

    const deleteImage = (_id: string) => {
        console.log(_id)
        fetch(`http://localhost:5000/files/delete_image?currentUserId=63bbb27d01e8d1f6e35f51ca`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
            },
            body: JSON.stringify({
                _id: _id
            })
        })
            .then((response) => response.json())
            .then((res) => {
                let filteredImages = images;
                filteredImages = images.filter((image) => {
                    return image._id !== _id;
                });
                setImages(filteredImages);
            })
    }

    return (
        <Dialog
            onClose={handleClick}
            fullWidth={true}
            maxWidth={"xl"}
            open={isOpen}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Image's
                <IconButton
                    aria-label="close"
                    onClick={handleClick}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <ImageList sx={{
                    mb: 8,
                    height: "100%",
                    width: "100%",
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))!important'
                }}>
                    {images?.map((item) => {
                        return (
                            <ImageListItem key={item._id}>
                                <img
                                    src={`http://localhost:5000/files/get_image_by_id?_id=${item._id}&auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc&currentUserId=63bbb27d01e8d1f6e35f51ca`}
                                    srcSet={`http://localhost:5000/files/get_image_by_id?_id=${item._id}&auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc&currentUserId=63bbb27d01e8d1f6e35f51ca`}
                                    alt={item.filename}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={item.filename}
                                    subtitle={item.uploadDate.toString()}
                                    actionIcon={
                                        <Container sx={{ display: 'flex !important', justifyContent: 'flex-end !important', paddingRight: '0 !important', paddingLeft: '0 !important' }}>
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`Delete image ${item.filename}`}
                                                component='label'
                                                onClick={() => { deleteImage(item._id) }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`Download image ${item.filename}`}
                                                component='label'
                                                onClick={() => { downloadImage(item._id, item.filename) }}
                                            >
                                                <DownloadForOfflineIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`Choose image ${item.filename}`}
                                                onClick={() => { chooseImage(item._id); handleClick(); }}
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </ Container>
                                    }
                                />
                            </ImageListItem>
                        )
                    })}
                </ImageList>
            </DialogContent>
            <DialogActions>
                <Button component='label' startIcon={<UploadIcon />}>
                    Upload new image
                    <input
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        onClick={() => console.log("hello")}
                    />
                </Button>
                <Button variant='contained' autoFocus onClick={handleClick}>
                    Save changes
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default PDFImageTable