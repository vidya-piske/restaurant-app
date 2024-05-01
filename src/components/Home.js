import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Space, ConfigProvider } from 'antd';
import { TinyColor } from '@ctrl/tinycolor';
import "./Home.css";

const Home = () => {
    const colors1 = ['#6253E1', '#04BEFE'];
    const getHoverColors = (colors) =>
      colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors) =>
      colors.map((color) => new TinyColor(color).darken(5).toString());

    return (
        <div className="home-container">
            <div className="title-container">
                <h1 className="title">Restaurant Management Dashboard</h1>
                <p className="subtitle">Welcome to our restaurant management platform! Let's elevate your dining experience.</p>
            </div>
            <Link to="/menu">
                <Space>
                    <ConfigProvider
                        theme={{
                            components: {
                                Button: {
                                    colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                                    colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                                    colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                                    lineWidth: 0,
                                },
                            },
                        }}
                    >
                        <Button type="primary" size="large">
                            View Menu
                        </Button>
                    </ConfigProvider>
                </Space>
            </Link>
        </div>
    );
};

export default Home;
