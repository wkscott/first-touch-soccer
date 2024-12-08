import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
    PolarRadiusAxis, ScatterChart, Scatter, ZAxis, ComposedChart,
    Treemap
} from 'recharts';
import DataTable from 'react-data-table-component';
import './Analytics.css';

const Analytics = () => {
    const [timeframe, setTimeframe] = useState('month');
    const [chartTypes, setChartTypes] = useState({
        bookings: 'line',
        revenue: 'bar',
        locations: 'pie',
        timeSlots: 'bar'
    });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        bookingTrends: [],
        revenue: [],
        userStats: {},
        locationStats: [],
        timeSlotPopularity: []
    });
    const [showTable, setShowTable] = useState({});

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`/api/admin/analytics?timeframe=${timeframe}`);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    const renderChart = (type, data, config) => {
        switch(type) {
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {config.lines.map(line => (
                            <Line 
                                key={line.key}
                                type="monotone" 
                                dataKey={line.key} 
                                stroke={line.color} 
                            />
                        ))}
                    </LineChart>
                );
            
            case 'area':
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {config.areas.map(area => (
                            <Area 
                                key={area.key}
                                type="monotone" 
                                dataKey={area.key} 
                                fill={area.color} 
                                stroke={area.color}
                            />
                        ))}
                    </AreaChart>
                );

            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {config.bars.map(bar => (
                            <Bar 
                                key={bar.key}
                                dataKey={bar.key} 
                                fill={bar.color}
                            />
                        ))}
                    </BarChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={config.value}
                            nameKey={config.name}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                );

            case 'radar':
                return (
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey={config.angleAxis} />
                        <PolarRadiusAxis />
                        <Radar 
                            dataKey={config.value} 
                            stroke={config.color} 
                            fill={config.color} 
                            fillOpacity={0.6} 
                        />
                        <Legend />
                    </RadarChart>
                );

            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis dataKey={config.yAxis} />
                        <ZAxis dataKey={config.zAxis} range={[64, 144]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Scatter
                            name={config.name}
                            data={data}
                            fill={config.color}
                        />
                    </ScatterChart>
                );

            case 'composed':
                return (
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={config.barKey} fill={config.barColor} />
                        <Line type="monotone" dataKey={config.lineKey} stroke={config.lineColor} />
                    </ComposedChart>
                );

            case 'treemap':
                return (
                    <Treemap
                        data={data}
                        dataKey={config.value}
                        aspectRatio={4/3}
                        stroke="#fff"
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Treemap>
                );

            default:
                return null;
        }
    };

    const renderDataTable = (data, columns) => {
        return (
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                dense
                highlightOnHover
                striped
                responsive
            />
        );
    };

    const toggleDataTable = (section) => {
        setShowTable(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (loading) return <div>Loading analytics...</div>;

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h2>Analytics Dashboard</h2>
                <div className="controls">
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="timeframe-selector"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Booking Trends */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>Booking Trends</h3>
                        <div className="chart-controls">
                            <select
                                value={chartTypes.bookings}
                                onChange={(e) => setChartTypes({
                                    ...chartTypes,
                                    bookings: e.target.value
                                })}
                                className="chart-type-selector"
                            >
                                <option value="line">Line Chart</option>
                                <option value="area">Area Chart</option>
                                <option value="bar">Bar Chart</option>
                                <option value="scatter">Scatter Plot</option>
                                <option value="composed">Composed Chart</option>
                            </select>
                            <button 
                                className="table-toggle"
                                onClick={() => toggleDataTable('bookings')}
                            >
                                {showTable.bookings ? 'Hide Table' : 'Show Table'}
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        {renderChart(chartTypes.bookings, data.bookingTrends, {
                            xAxis: 'date',
                            yAxis: 'bookings',
                            zAxis: 'waitlist',
                            name: 'Bookings',
                            color: '#8884d8',
                            barKey: 'bookings',
                            barColor: '#8884d8',
                            lineKey: 'waitlist',
                            lineColor: '#82ca9d'
                        })}
                    </ResponsiveContainer>
                    {showTable.bookings && renderDataTable(data.bookingTrends, [
                        {
                            name: 'Date',
                            selector: row => row.date,
                            sortable: true
                        },
                        {
                            name: 'Bookings',
                            selector: row => row.bookings,
                            sortable: true
                        },
                        {
                            name: 'Waitlist',
                            selector: row => row.waitlist,
                            sortable: true
                        }
                    ])}
                </div>

                {/* Revenue Analysis */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>Revenue Analysis</h3>
                        <div className="chart-controls">
                            <select
                                value={chartTypes.revenue}
                                onChange={(e) => setChartTypes({
                                    ...chartTypes,
                                    revenue: e.target.value
                                })}
                                className="chart-type-selector"
                            >
                                <option value="bar">Bar Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="area">Area Chart</option>
                                <option value="composed">Composed Chart</option>
                            </select>
                            <button 
                                className="table-toggle"
                                onClick={() => toggleDataTable('revenue')}
                            >
                                {showTable.revenue ? 'Hide Table' : 'Show Table'}
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        {renderChart(chartTypes.revenue, data.revenue, {
                            xAxis: 'date',
                            yAxis: 'amount',
                            name: 'Revenue',
                            color: '#82ca9d',
                            barKey: 'amount',
                            barColor: '#82ca9d',
                            lineKey: 'amount',
                            lineColor: '#8884d8'
                        })}
                    </ResponsiveContainer>
                    {showTable.revenue && renderDataTable(data.revenue, [
                        {
                            name: 'Date',
                            selector: row => row.date,
                            sortable: true
                        },
                        {
                            name: 'Amount',
                            selector: row => `$${row.amount.toFixed(2)}`,
                            sortable: true
                        }
                    ])}
                </div>

                {/* User Engagement */}
                <div className="chart-container">
                    <h3>User Engagement</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <h4>Active Users</h4>
                            <p>{data.userStats.activeUsers}</p>
                        </div>
                        <div className="stat-box">
                            <h4>New Users</h4>
                            <p>{data.userStats.newUsers}</p>
                        </div>
                        <div className="stat-box">
                            <h4>Repeat Bookings</h4>
                            <p>{data.userStats.repeatBookings}%</p>
                        </div>
                        <div className="stat-box">
                            <h4>Avg. Sessions/User</h4>
                            <p>{data.userStats.avgSessionsPerUser}</p>
                        </div>
                    </div>
                </div>

                {/* Location Popularity */}
                <div className="chart-container">
                    <h3>Location Popularity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.locationStats}
                                dataKey="bookings"
                                nameKey="location"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {data.locationStats.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Popular Time Slots */}
                <div className="chart-container">
                    <h3>Popular Time Slots</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.timeSlotPopularity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

export default Analytics; 