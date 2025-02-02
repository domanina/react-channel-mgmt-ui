import React, { useState, useEffect, useRef } from 'react';
import { Button, Offcanvas, Form, Col, Row } from 'react-bootstrap';
import { addItem, uploadImage } from '../../../api/apiRequests';


const AddItem = ({ show, handleClose, fetchData }) => {
    const initialitemData = {
        type: '',
        title: '',
        description: '',
        images: '',
        startTime: '',
        endTime: '',
        base64Image: ''
    };

    const [validated, setValidated] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [itemData, setitemData] = useState(initialitemData);
    const [imagesList, setImagesList] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imagesData = await fetchImageList();
                const images = imagesData.Contents
                    .filter(item => item.Key !== ".../")
                    .map(item => item.Key.split('/').pop());
                setImagesList(images);
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        const errors = {};
        for (const field in itemData) {
            if (['title', 'description', 'images'].includes(field)) {
                errors[field] = validateTextField(field, itemData[field]);
            }
        }

        const dateErrors = validateDateTimeFields(itemData.startTime, itemData.endTime);
        setFieldErrors(errors);
        setFieldErrors(prevErrors => ({
            ...prevErrors,
            ...dateErrors
        }));
    }, [itemData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setitemData(previtemData => ({
            ...previtemData,
            [name]: value
        }));
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const errors = await validateImage(file);

        if (Object.keys(errors).length === 0) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                setitemData(previtemData => ({
                    ...previtemData,
                    base64Image: base64String,
                    fileName: file.name
                }));
                setSelectedFileName(file.name);
                setValidated(true);
            };
            reader.onerror = () => {
                setFieldErrors(prevErrors => ({
                    ...prevErrors,
                    images: 'Error reading file'
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFieldErrors(prevErrors => ({
                ...prevErrors,
                images: errors.file
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                let updateditemData = { ...itemData };
                if (itemData.base64Image && itemData.fileName) {
                    const uploadedFileName = await uploadImage(itemData.base64Image, itemData.fileName);
                    updateditemData = { ...updateditemData, images: uploadedFileName };
                }

                const optionalFields = ['description', 'name'];
                optionalFields.forEach(field => {
                    if (!updateditemData[field]) {
                        updateditemData[field] = '';
                    }
                });

                updateditemData.startTime = convertToUnixUtc(itemData.startTime);
                updateditemData.endTime = convertToUnixUtc(itemData.endTime);

                await handleAddItemtem(updateditemData);
                handleClose();
            } catch (error) {
                console.error('Error creating item:', error);
            }
        }
        setValidated(true);
    };

    const handleAddItemtem = async (itemData) => {
        try {
            await addItem({
                ...itemData,
            });
            setitemData(initialitemData);
            fetchData();
        } catch (error) {
            console.error('Error creating item:', error);
            throw new Error(`Error creating item: ${error.message}`);
        }
    };


    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add new item</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <UploadFromFile onDataSelect={handleDataSelect} />
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="title">Show Title*</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control mb-1"
                                id="title"
                                name="title"
                                value={itemData.title}
                                onChange={handleChange}
                                required
                                isInvalid={!!fieldErrors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                                {fieldErrors.title}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label htmlFor="startTime">Start Time ({parsedTimeZone})*</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                className="form-control mb-1"
                                id="startTime"
                                name="startTime"
                                value={itemData.startTime}
                                min={minStartDateTime}
                                onChange={handleChange}
                                required
                                isInvalid={!!fieldErrors.startTime}
                            />
                            <Form.Control.Feedback type="invalid">
                                {fieldErrors.startTime}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Row} controlId="images">
                            <Form.Label column sm="3">Image*</Form.Label>
                            <Col sm="9">
                                <Form.Select
                                    name="images"
                                    className="form-select mb-1"
                                    value={itemData.images}
                                    onChange={handleChange}
                                    isInvalid={!!fieldErrors.images}
                                >
                                    <option value="">Select an image...</option>
                                    {imagesList.map((image, index) => (
                                        <option key={index} value={image}>{image}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.images}
                                </Form.Control.Feedback>
                            </Col>
                            <Col sm={{ span: 9, offset: 3 }}>
                                <Button variant="secondary" className="mt-2 w-100" onClick={() => fileInputRef.current.click()}>
                                    Or upload from your computer
                                </Button>
                                <input
                                    type="file"
                                    accept=".jpg"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                />
                                {selectedFileName && (
                                    <div className="mt-2 small text-muted">{selectedFileName}</div>
                                )}
                            </Col>
                        </Form.Group>

                        <Button
                            type="submit"
                            className="btn btn-primary mt-3"
                            disabled={!isFormValid(itemData)}
                        >Create
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default AddItem;
