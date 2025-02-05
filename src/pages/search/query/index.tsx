//path suggestion: app/zowner-info/page.tsx

"use client";

import React from "react";
import { Layout, Menu, Row, Col, Input, Select, Button, Typography } from "antd";
import type { MenuProps } from "antd";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

/**
 * 一个简化示例，模拟截图所示结构：
 * - 顶部导航栏，包含用户名、余额、历史搜索、登出等选项
 * - 中部显示主标题(ZOWNER.INFO)、副标题(Normal Search) 和搜索区域
 * - 可以根据需要进行样式调整、添加后台请求逻辑等
 */
export const QueryInfoPage = () => {
    // 顶部菜单项定义（仅演示）


    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* 顶部导航 */}


            {/* 中间主体内容 */}
            <Content style={{ padding: "2rem" }}>
                <Row justify="center" style={{ marginTop: "2rem" }}>
                    <Col xs={24} sm={16} md={12} lg={10} xl={8} style={{ textAlign: "center" }}>
                        {/* 主标题 */}
                        <Title style={{ fontWeight: 400, marginBottom: 0 }}>DB Center</Title>
                        <Text strong style={{ fontSize: "1.25rem" }}>
                            Normal Search
                        </Text>

                        {/* 搜索框区域 */}
                        <div style={{ margin: "2rem 0 1rem" }}>
                            <Row gutter={8} wrap={false} justify="center">
                                <Col flex="auto">
                                    <Input
                                        placeholder="Search Keyword"
                                        size="large"
                                        style={{ width: "100%" }}
                                    />
                                </Col>
                                <Col>
                                    <Select
                                        defaultValue="- by IC -"
                                        size="large"
                                        style={{ width: 120 }}
                                        options={[
                                            { label: "- by IC -", value: "ic" },
                                            { label: "- by Name -", value: "name" },
                                            { label: "- by Mobile -", value: "phone" },
                                            // 也可加入其他选项
                                        ]}
                                    />
                                </Col>
                            </Row>
                            {/* 显示数据库中数量示例 */}
                            <Text style={{ display: "block", marginTop: "0.5rem", color: "#666" }}>
                                223,153,934 in database
                            </Text>
                        </div>

                        {/* Buy Now 按钮 */}
                        <Button type="primary" size="large" style={{ marginBottom: "1rem" }}>
                            Buy Now
                        </Button>
                        <br />
                        <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                            0.5 token per search
                        </Text>
                    </Col>
                </Row>
            </Content>
            
        </Layout>
    );
}
