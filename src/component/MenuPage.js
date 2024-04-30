    import React, { useState, useEffect } from 'react';
    import { Table, Button, Modal, Input, Space, ConfigProvider } from 'antd';
    import { TinyColor } from '@ctrl/tinycolor';
    import './MenuPage.css'; 

    const MenuPage = () => {
        const [menuItems, setMenuItems] = useState([]);
        const [pagination, setPagination] = useState({
            pageSize: 4,
            current: 1,
        });
        const [editItem, setEditItem] = useState(null);
        const [isEditModalVisible, setIsEditModalVisible] = useState(false);
        const [editedValues, setEditedValues] = useState({
            item_name: '',
            price: '',
            description: '',
            category: ''
        });
        const [deleteModalVisible, setDeleteModalVisible] = useState(false);
        const [deleteItemId, setDeleteItemId] = useState(null);
        const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
        const [searchText, setSearchText] = useState('');
        const [createModalVisible, setCreateModalVisible] = useState(false);

        // gradient button styling
        const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];
        const getHoverColors = (colors) =>
            colors.map((color) => new TinyColor(color).lighten(5).toString());
        const getActiveColors = (colors) =>
            colors.map((color) => new TinyColor(color).darken(5).toString());

            const fetchMenuData = () => {
                fetch('http://127.0.0.1:5000/api/menu')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json(); 
                    })
                    .then(data => {
                        setMenuItems(data);
                        setPagination(prevPagination => ({
                            ...prevPagination,
                            total: data.length // Update total based on fetched data
                        }));
                    })
                    .catch(error => console.error('Error fetching menu data:', error));
            };
        
            useEffect(() => {
                fetchMenuData();
            }, []);

        const columns = [
            {
                title: 'Item Name',
                dataIndex: 'item_name',
                key: 'item_name',
                sorter: (a, b) => a.item_name.localeCompare(b.item_name), // Enable sorting
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => `$${text}`,
                sorter: (a, b) => a.price - b.price, // Enable sorting
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                sorter: (a, b) => a.description.localeCompare(b.description), // Enable sorting
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                sorter: (a, b) => a.category.localeCompare(b.category), // Enable sorting
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (text, record) => (
                    <Button.Group>
                        <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                        <Button type="link" onClick={() => showDeleteModal(record.key)}>Delete</Button>
                    </Button.Group>
                ),
            },
        ];

        const onPageChange = (page, pageSize) => {
            // Update pagination state
            setPagination(prevPagination => ({ ...prevPagination, current: page }));
        };

        const handleEdit = (record) => {
            setEditItem(record);
            setIsEditModalVisible(true);
            setEditedValues({
                item_name: record.item_name,
                price: record.price,
                description: record.description,
                category: record.category
            });
        };

        const handleDelete = () => {
            fetch(`http://127.0.0.1:5000/api/menu/delete/${deleteItemId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const updatedMenuItems = menuItems.filter(item => item.id !== deleteItemId);
                setMenuItems(updatedMenuItems);
                setDeleteSuccessModalVisible(true);
            })
            .catch(error => console.error('Error deleting menu item:', error));
        };

        const showDeleteModal = (itemId) => {
            setDeleteItemId(itemId);
            setDeleteModalVisible(true);
        };

        const handleDeleteModalOk = () => {
            handleDelete();
            setDeleteModalVisible(false);
        };

        const handleDeleteModalCancel = () => {
            setDeleteModalVisible(false);
        };

        const handleDeleteSuccessModalOk = () => {
            setDeleteSuccessModalVisible(false);
        };

        const handleInputChange = (e, field) => {
            const value = e.target.value;
            setEditedValues(prevValues => ({
                ...prevValues,
                [field]: value
            }));
        };

        const getRowClassName = (record, index) => {
            return index % 2 === 0 ? 'even-row' : 'odd-row';
        };

        const formattedMenuItems = menuItems.map(item => ({
            key: item[0], // Assuming the first element is the ID
            item_name: item[1],
            price: item[2],
            description: item[3],
            category: item[4]
        }));

        const filteredMenuItems = formattedMenuItems.filter(item =>
            Object.values(item).some(val =>
                val.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );

        const handleEditModalOk = () => {
            setIsEditModalVisible(false);
            fetch(`http://127.0.0.1:5000/api/menu/update/${editItem.key}`, {
                method: 'PUT',
                body: JSON.stringify({
                    item_name: editedValues.item_name,
                    price: editedValues.price,
                    description: editedValues.description,
                    category: editedValues.category
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const updatedMenuItems = menuItems.map(item => {
                    if (item.id === editItem.key) {
                        return {
                            ...item,
                            item_name: editedValues.item_name,
                            price: editedValues.price,
                            description: editedValues.description,
                            category: editedValues.category
                        };
                    }
                    return item;
                });
                setMenuItems(updatedMenuItems);
            })
            .catch(error => console.error('Error updating menu item:', error));
        };

        const handleCreateModalOk = () => {
            // Call API to add a new menu item
            fetch('http://127.0.0.1:5000/api/menu/add', {
                method: 'POST',
                body: JSON.stringify({
                    item_name: editedValues.item_name,
                    price: editedValues.price,
                    description: editedValues.description,
                    category: editedValues.category
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Refresh menu items
                fetchMenuData();
                setCreateModalVisible(false); // Close the dialog box after adding the item
            })
            .catch(error => console.error('Error adding new menu item:', error));
        };
        
        // Function to handle cancellation of creating a new menu item
        // Function to handle cancellation of creating a new menu item
        const handleCreateModalCancel = () => {
            setCreateModalVisible(false); // Close the dialog box
            setEditedValues({
                item_name: '',
                price: '',
                description: '',
                category: ''
            });
        };

        return (    
            <div className="menu-page-container">
                <h2>All Menu Items</h2>
                <Space>
                    <ConfigProvider
                        theme={{
                            components: {
                                Button: {
                                    colorPrimary: `linear-gradient(90deg,  ${colors2.join(', ')})`,
                                    colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(colors2).join(', ')})`,
                                    colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(colors2).join(', ')})`,
                                    lineWidth: 0,
                                },
                            },
                        }}
                    >
                      <Modal
                            title="Create Item"
                            visible={createModalVisible}
                            onOk={handleCreateModalOk}
                            onCancel={handleCreateModalCancel}
                        >
                            <p>Item Name: <Input value={editedValues.item_name} onChange={(e) => handleInputChange(e, 'item_name')} /></p>
                            <p>Price: <Input value={editedValues.price} onChange={(e) => handleInputChange(e, 'price')} /></p>
                            <p>Description: <Input value={editedValues.description} onChange={(e) => handleInputChange(e, 'description')} /></p>
                            <p>Category: <Input value={editedValues.category} onChange={(e) => handleInputChange(e, 'category')} /></p>
                        </Modal>

                        <Button type="primary" size="large" onClick={() => setCreateModalVisible(true)}>
                            + Create Menu
                        </Button>
                    </ConfigProvider>
                    <Input.Search
                        placeholder="Search..."
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                    />
                </Space>
                <Table
                    dataSource={filteredMenuItems}
                    columns={columns}
                    pagination={{
                        ...pagination,
                        position: ['bottomCenter'],
                        onChange: onPageChange
                    }}
                    rowClassName={getRowClassName}
                    bordered
                    className="custom-table"
                    headerClassName="custom-header"
                    onRow={(record) => ({
                        onClick: () => handleEdit(record),
                    })}
                    loading={!menuItems.length}
                />

                <Modal
                    title="Edit Item"
                    visible={isEditModalVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setIsEditModalVisible(false)}
                >
                    <p>Item Name: <Input value={editedValues.item_name} onChange={(e) => handleInputChange(e, 'item_name')} /></p>
                    <p>Price: <Input value={editedValues.price} onChange={(e) => handleInputChange(e, 'price')} /></p>
                    <p>Description: <Input value={editedValues.description} onChange={(e) => handleInputChange(e, 'description')} /></p>
                    <p>Category: <Input value={editedValues.category} onChange={(e) => handleInputChange(e, 'category')} /></p>
                </Modal>

                <Modal
                    title="Confirm Delete"
                    visible={deleteModalVisible}
                    onOk={handleDeleteModalOk}
                    onCancel={handleDeleteModalCancel}
                >
                    <p>Are you sure you want to delete this item?</p>
                </Modal>

                <Modal
                    title="Delete Success"
                    visible={deleteSuccessModalVisible}
                    onOk={handleDeleteSuccessModalOk}
                    onCancel={handleDeleteSuccessModalOk}
                >
                    <p>Item deleted successfully!</p>
                </Modal>
            </div>
        );
    };

    export default MenuPage;
