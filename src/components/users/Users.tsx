import React, { useEffect, useState, FC } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { Typography, Button, Table, message, Image } from "antd";

// Types
type IdentityType = {
    name?: string;
    imageUrl?: string;
    [key: string]: any;
};

type UserData = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
};

// API endpoint constants
const API_ENDPOINTS = {
    GET_USER_PROFILE: "/api/user-profile",
    GET_USERS_LIST: "/api/users",
    LOGOUT: "/api/logout", // Added logout endpoint
};

export const Users: FC = () => {
    const { Title } = Typography;

    // Local state for user identity and table data
    const [identity, setIdentity] = useState<IdentityType | null>(null);
    const [usersData, setUsersData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableLoading, setTableLoading] = useState(false);

    // Fetch user identity (profile)
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_ENDPOINTS.GET_USER_PROFILE);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setIdentity(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                message.error(error instanceof Error ? error.message : "Failed to fetch user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Fetch user list
    useEffect(() => {
        const fetchUsersList = async () => {
            setTableLoading(true);
            try {
                const response = await fetch(API_ENDPOINTS.GET_USERS_LIST);
                if (!response.ok) {
                    throw new Error(`Failed to fetch users list: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setUsersData(data);
            } catch (error) {
                console.error("Error fetching users list:", error);
                message.error(error instanceof Error ? error.message : "Failed to fetch users list");
            } finally {
                setTableLoading(false);
            }
        };

        fetchUsersList();
    }, []);

    // Logout function (using fetch, mimicking REST)
    const handleLogout = async () => {
        setLoading(true); // Set loading for the logout button
        try {
            const response = await fetch(API_ENDPOINTS.LOGOUT, {
                method: "POST", // Assuming logout is a POST request
                // Add headers if needed (e.g., for authentication tokens)
                // headers: {
                //   'Authorization': `Bearer ${yourAuthToken}`,
                // },
            });

            if (!response.ok) {
                throw new Error(`Logout failed: ${response.status} ${response.statusText}`);
            }

            // Assuming successful logout clears user data and redirects (you'll need to handle redirection)
            setIdentity(null);
            setUsersData([]); // Clear user data on logout
            message.success("Logged out successfully!");
            // Redirect to login page or home page (replace with your routing logic)
            window.location.href = "/login";  // Example redirection

        } catch (error) {
            console.error("Error during logout:", error);
            message.error(error instanceof Error ? error.message : "Logout failed");
        } finally {
            setLoading(false); // Reset loading for the logout button
        }
    };


    return (
        <>
            <Title
                style={{
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: 600,
                    padding: "1rem",
                    color: "#67be23",
                }}
            >
                Simple User Listing Application
            </Title>

  
                <Title
                    style={{
                        fontSize: "1.2rem",
                        margin: 0,
                    }}
                >
                    {identity?.imageUrl && (
                        <Image
                            style={{
                                borderRadius: "50%",
                                marginRight: "1rem",
                                height: "60px",
                                verticalAlign: "middle",
                            }}
                            src={identity.imageUrl}
                            alt="profile"
                        />
                    )}
                    Welcome <span style={{ color: "#67be23" }}>{identity?.name}</span>!
                </Title>

                <Button
                    type="primary"
                    size="large"
                    htmlType="button"
                    icon={<GoogleOutlined />}
                    loading={loading}
                    onClick={handleLogout} // Use the REST-based logout handler
                >
                    Sign out
                </Button>
            

            <Table
                dataSource={usersData}
                loading={tableLoading}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                style={{ margin: "1rem" }}
            >
                <Table.Column dataIndex="id" title="ID" sorter={(a: UserData, b: UserData) => a.id.localeCompare(b.id)} />
                <Table.Column dataIndex="firstName" title="First Name" sorter={(a: UserData, b: UserData) => a.firstName.localeCompare(b.firstName)} />
                <Table.Column dataIndex="lastName" title="Last Name" sorter={(a: UserData, b: UserData) => a.lastName.localeCompare(b.lastName)} />
                <Table.Column dataIndex="email" title="Email" sorter={(a: UserData, b: UserData) => a.email.localeCompare(b.email)} />
                <Table.Column dataIndex="birthday" title="Birthday" sorter={(a: UserData, b: UserData) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime()} />
            </Table>
        </>
    );
};

export default Users;