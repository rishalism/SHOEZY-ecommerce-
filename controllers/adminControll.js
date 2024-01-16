const session = require('express-session');
const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const moment = require('moment');


const securepassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}


const adminLoginLoad = async (req, res) => {
    try {
        res.render('adminLogin')

    } catch (error) {
        console.log(error.message);
    }
}




const verifyAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        const findAdmin = await users.findOne({ email: email });

        if (findAdmin) {

            const passwordMatch = await bcrypt.compare(password, findAdmin.password);

            if (passwordMatch) {

                if (findAdmin.is_admin === 0) {
                    res.render('adminLogin', { message1: 'oops! looks like you are not an admin' })
                } else {
                    req.session.admin = findAdmin
                    req.session.admin._id = findAdmin._id;
                    res.redirect('/admin/dashboard')
                }

            }
            else {

                const message = 'invalid password'
                res.render('adminLogin', { message });
                console.log('password is incorrect');
            }


        } else {

            res.render('adminLogin', { message1: 'email is not found' });
            console.log('email not foud in the database');
        }

    } catch (error) {
        console.log(error.message);
    }
}





const logout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {

        console.log(error);
    }
}




const loadDashboard = async (req, res) => {
    try {
        res.render('dashboard')

    } catch (error) {
        console.log(error.message);

    }
}



const blockUser = async (req, res) => {
    try {
        const userId = req.body.userID

        const findUser = await users.findById({ _id: userId });
        findUser.is_blocked = true;
        const data = await findUser.save();
        if (data) {
            res.json({ message: "user is blocked succesfully" })
        }

    } catch (error) {

        console.log(error.message);
    }


}


const unBlockUser = async (req, res) => {
    try {
        const userId = req.body.userID

        const findUser = await users.findById({ _id: userId });
        findUser.is_blocked = false;
        const data = await findUser.save();
        if (data) {
            res.json({ message: "user is UnBlocked succesfully" })
        }

    } catch (error) {

        console.log(error.message);
    }
}





const salesData = async (req, res) => {
    try {
        const totalusers = await users.find({ is_admin: 0 }).count();
        const totalProducts = await productModel.find().count();
        const totalorders = await orderModel.find().count();
        const totalrevenue = await orderModel.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]);
        let totalRevenue = 0;
        if (totalrevenue.length > 0) {
            [{ totalRevenue }] = totalrevenue;
        }
        const paymentSalesData = await orderModel.aggregate([
            {
                $match: {
                    paymentMethod: { $in: ["cod", "Net Banking"] },
                    // Add any additional conditions if needed
                },
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    totalAmount: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    totalAmount: 1,
                    orderCount: 1,
                },
            },
        ]);

        ///////////////////////////////  daily orders  ////////////////////////////////

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the beginning of today

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999); // Set to the end of today
        const todaysOrders = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "ordered",
                    orderDate: {
                        $gte: today,
                        $lt: endOfDay,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    today: { $first: { $dateToString: { format: "%Y-%m-%d", date: today } } },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    today: 1,
                    orderCount: 1,
                },
            },
        ]);

        const todaySales = {
            orderCount: [],
        };



        todaySales.orderCount = todaysOrders.map(({ orderCount }) => orderCount);

        ///////////////////// weekly orders  /////////////////////////////////

        const weeklyOrders = await orderModel.aggregate([
            {
                $project: {
                    orderDate: 1,
                    totalAmount: 1,
                    year: { $year: "$orderDate" },
                    week: { $week: "$orderDate" },
                },
            },
            {
                $group: {
                    _id: { year: "$year", week: "$week" },
                    fromDate: { $min: "$orderDate" },
                    toDate: { $max: "$orderDate" },
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }, // Count the number of orders
                },
            },
            {
                $project: {
                    _id: 0,
                    dateRange: {
                        $concat: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$fromDate" } },
                            " to ",
                            { $dateToString: { format: "%Y-%m-%d", date: "$toDate" } },
                        ],
                    },
                    totalSales: 1,
                    orderCount: 1,
                },
            },
            {
                $sort: { fromDate: 1 },
            },
            {
                $limit: 6,
            },
        ]);


        const weeklySales = {
            totalAmount: 0,
            orderCount: [],
            label: [],
        };

        weeklySales.totalAmount = weeklyOrders.reduce((acc, { totalAmount }) => {
            return acc + Number(totalAmount);
        }, 0);

        weeklySales.orderCount = weeklyOrders.map(({ orderCount }) => orderCount);
        weeklySales.label = weeklyOrders.map(({ label }) => label);


        /////////////////////////////////////////////////    monthly orders  ///////////////////////////////////////////////////////


        const monthlyorders = await orderModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        month: { $month: "$orderDate" },
                    },
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                                { case: { $eq: ["$_id.month", 12] }, then: "December" },
                            ],
                            default: null,
                        },
                    },
                    totalSales: 1,
                    orderCount: 1,
                },
            },
        ]);

        const monthlySales = {
            totalSales: 0,
            orderCount: [],
            month: [],
        };

        monthlySales.totalSales = monthlyorders.reduce((acc, { totalSales }) => {
            return acc + Number(totalSales);
        }, 0);

        monthlySales.orderCount = monthlyorders.map(({ orderCount }) => orderCount);
        monthlySales.month = monthlyorders.map(({ month }) => month);

        //////////////////////////////////   yearly orders ///////////////////////////////////

        const yearlyOrders = await orderModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                    },
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    totalSales: 1,
                    orderCount: 1,
                },
            },
        ]);

        const yearlySales = {
            totalSales: 0,
            orderCount: [],
            year: [],
        };

        yearlySales.totalSales = yearlyOrders.reduce((acc, { totalSales }) => {
            return acc + Number(totalSales);
        }, 0);

        yearlySales.orderCount = yearlyOrders.map(({ orderCount }) => orderCount);
        yearlySales.year = yearlyOrders.map(({ year }) => year);


        res.json({
            totalusers,
            totalProducts,
            totalorders,
            totalRevenue,
            paymentSalesData,
            todaySales,
            weeklySales,
            monthlySales,
            yearlySales
        });

    } catch (error) {
        console.log(error.message);
    }
};


const LoadSalesReport = async (req, res) => {
    try {

        res.render('salesReportPage')
    } catch (error) {

        console.log(error.message);
    }
}


const getSalesData = async (req, res) => {
    try {

        const { startdate, endDate } = req.body
        if (!startdate && !endDate) {
            return res.status(400).json({ message: 'please selecet an date ', value: 1 });
        } else {
            const salesdata = await orderModel
                .find({
                    orderDate: {
                        $gte: new Date(startdate),
                        $lte: new Date(endDate)
                    }
                }).populate('shippingAddress')
            const StringSalesData = salesdata.map(order => ({
                id: order.id.toString(),
                customerID: order.customerID.toString(),
                state: order.shippingAddress.state,
                town: order.shippingAddress.town,
                streetAddress: order.shippingAddress.streetAddress,
                houseName: order.shippingAddress.houseName,
                country: order.shippingAddress.country,
                zipcode: order.shippingAddress.zipcode,
                orderStatus: order.orderStatus,
                paymentMethod: order.paymentMethod,
                orderDate: order.orderDate.toLocaleDateString(),
                updateAt: order.updatedAt.toLocaleDateString(),
                trackId: order.trackID.toString(),
                totalAmount : order.totalAmount
            }))

           return res.status(200).json({StringSalesData});
        }

    } catch (error) {

        console.log(error.message);
    }
}


module.exports = {
    adminLoginLoad,
    verifyAdmin,
    loadDashboard,
    blockUser,
    unBlockUser,
    logout,
    salesData,
    LoadSalesReport,
    getSalesData
}