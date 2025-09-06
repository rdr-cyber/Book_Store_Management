module.exports = {

"[project]/.next-internal/server/app/api/auth/login/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/src/lib/supabase.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createSupabaseBrowserClient": (()=>createSupabaseBrowserClient),
    "default": (()=>__TURBOPACK__default__export__),
    "isSupabaseConfigured": (()=>isSupabaseConfigured),
    "supabase": (()=>supabase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <module evaluation>");
;
;
// Get environment variables with fallbacks
const supabaseUrl = ("TURBOPACK compile-time value", "your_supabase_project_url") || 'https://placeholder.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "your_supabase_anon_key") || 'placeholder-key';
// Validate that we have proper Supabase configuration
const isValidSupabaseConfig = supabaseUrl !== 'your_supabase_project_url' && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'your_supabase_anon_key' && supabaseAnonKey !== 'placeholder-key' && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
// Create a mock client for development when Supabase is not configured
const createMockClient = ()=>({
        auth: {
            signUp: ()=>Promise.resolve({
                    data: null,
                    error: new Error('Supabase not configured')
                }),
            signInWithPassword: ()=>Promise.resolve({
                    data: null,
                    error: new Error('Supabase not configured')
                }),
            signOut: ()=>Promise.resolve({
                    error: null
                }),
            getUser: ()=>Promise.resolve({
                    data: {
                        user: null
                    },
                    error: null
                }),
            onAuthStateChange: (callback)=>{
                // Return a mock subscription
                return {
                    data: {
                        subscription: {
                            unsubscribe: ()=>{}
                        }
                    }
                };
            }
        },
        from: (table)=>({
                select: ()=>({
                        eq: ()=>({
                                single: ()=>Promise.resolve({
                                        data: null,
                                        error: new Error('Supabase not configured')
                                    }),
                                order: ()=>Promise.resolve({
                                        data: [],
                                        error: null
                                    })
                            }),
                        order: ()=>Promise.resolve({
                                data: [],
                                error: null
                            })
                    }),
                insert: ()=>({
                        select: ()=>({
                                single: ()=>Promise.resolve({
                                        data: null,
                                        error: new Error('Supabase not configured')
                                    })
                            })
                    }),
                update: ()=>({
                        eq: ()=>Promise.resolve({
                                error: new Error('Supabase not configured')
                            })
                    }),
                delete: ()=>({
                        eq: ()=>Promise.resolve({
                                error: new Error('Supabase not configured')
                            })
                    })
            }),
        rpc: ()=>Promise.resolve({
                error: new Error('Supabase not configured')
            })
    });
const supabase = (()=>{
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    return createMockClient();
})();
const createSupabaseBrowserClient = ()=>{
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    return createMockClient();
};
const isSupabaseConfigured = isValidSupabaseConfig;
const __TURBOPACK__default__export__ = supabase;
}}),
"[project]/src/lib/database.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createBook": (()=>createBook),
    "createOrder": (()=>createOrder),
    "createReview": (()=>createReview),
    "createUser": (()=>createUser),
    "followAuthor": (()=>followAuthor),
    "getAllBooks": (()=>getAllBooks),
    "getAuthorAnalytics": (()=>getAuthorAnalytics),
    "getAuthorFollowers": (()=>getAuthorFollowers),
    "getBookById": (()=>getBookById),
    "getBookReviews": (()=>getBookReviews),
    "getBooksByAuthor": (()=>getBooksByAuthor),
    "getUserByEmail": (()=>getUserByEmail),
    "getUserById": (()=>getUserById),
    "getUserOrders": (()=>getUserOrders),
    "hasUserPurchasedBook": (()=>hasUserPurchasedBook),
    "unfollowAuthor": (()=>unfollowAuthor),
    "updateAuthorAnalytics": (()=>updateAuthorAnalytics),
    "updateBook": (()=>updateBook),
    "updateOrderStatus": (()=>updateOrderStatus),
    "updateReview": (()=>updateReview),
    "updateUser": (()=>updateUser)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
// In-memory storage for development when Supabase is not configured
let mockUsers = [];
let mockBooks = [];
let mockOrders = [];
let mockReviews = [];
let mockFollows = [];
// Helper function to generate mock IDs
const generateMockId = ()=>`mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const createUser = async (userData)=>{
    try {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
            // Mock implementation
            const mockUser = {
                id: generateMockId(),
                ...userData,
                createdAt: new Date()
            };
            mockUsers.push(mockUser);
            return mockUser.id;
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').insert({
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            avatar_url: userData.avatarUrl,
            bio: userData.bio,
            is_active: true,
            followed_authors: userData.role === 'reader' ? [] : undefined,
            purchased_books: userData.role === 'reader' ? [] : undefined,
            author_verified: userData.role === 'author' ? false : undefined,
            total_books: userData.role === 'author' ? 0 : undefined,
            total_sales: userData.role === 'author' ? 0 : undefined,
            total_revenue: userData.role === 'author' ? 0 : undefined
        }).select().single();
        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};
const getUserByEmail = async (email)=>{
    try {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
            // Mock implementation
            const user = mockUsers.find((u)=>u.email === email);
            return user || null;
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('email', email).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;
        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            avatarUrl: data.avatar_url,
            bio: data.bio,
            createdAt: data.created_at,
            isActive: data.is_active,
            followedAuthors: data.followed_authors,
            purchasedBooks: data.purchased_books,
            authorVerified: data.author_verified,
            totalBooks: data.total_books,
            totalSales: data.total_sales,
            totalRevenue: data.total_revenue
        };
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
};
const getUserById = async (userId)=>{
    try {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
            // Mock implementation
            const user = mockUsers.find((u)=>u.id === userId);
            return user || null;
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('id', userId).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;
        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            avatarUrl: data.avatar_url,
            bio: data.bio,
            createdAt: data.created_at,
            isActive: data.is_active,
            followedAuthors: data.followed_authors,
            purchasedBooks: data.purchased_books,
            authorVerified: data.author_verified,
            totalBooks: data.total_books,
            totalSales: data.total_sales,
            totalRevenue: data.total_revenue
        };
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};
const updateUser = async (userId, updates)=>{
    try {
        const updateData = {};
        if (updates.firstName) updateData.first_name = updates.firstName;
        if (updates.lastName) updateData.last_name = updates.lastName;
        if (updates.email) updateData.email = updates.email;
        if (updates.role) updateData.role = updates.role;
        if (updates.avatarUrl) updateData.avatar_url = updates.avatarUrl;
        if (updates.bio) updateData.bio = updates.bio;
        if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
        if (updates.followedAuthors) updateData.followed_authors = updates.followedAuthors;
        if (updates.purchasedBooks) updateData.purchased_books = updates.purchasedBooks;
        if (updates.authorVerified !== undefined) updateData.author_verified = updates.authorVerified;
        if (updates.totalBooks !== undefined) updateData.total_books = updates.totalBooks;
        if (updates.totalSales !== undefined) updateData.total_sales = updates.totalSales;
        if (updates.totalRevenue !== undefined) updateData.total_revenue = updates.totalRevenue;
        updateData.updated_at = new Date().toISOString();
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update(updateData).eq('id', userId);
        if (error) throw error;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
const createBook = async (bookData)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').insert({
            title: bookData.title,
            author_name: bookData.authorName,
            author_id: bookData.authorId,
            price: bookData.price,
            image_url: bookData.imageUrl,
            description: bookData.description,
            category: bookData.category,
            cover_type: bookData.coverType,
            stock: bookData.stock,
            reorder_point: bookData.reorderPoint,
            book_file_url: bookData.bookFileUrl,
            sales: 0,
            revenue: 0,
            average_rating: 0,
            total_reviews: 0
        }).select().single();
        if (error) throw error;
        // Update author's book count
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].rpc('increment_user_books', {
            user_id: bookData.authorId
        });
        if (updateError) {
            // Fallback: manually update
            const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('total_books').eq('id', bookData.authorId).single();
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                total_books: (userData?.total_books || 0) + 1
            }).eq('id', bookData.authorId);
        }
        return data.id;
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};
const getBooksByAuthor = async (authorId)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').select('*').eq('author_id', authorId).order('published_at', {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map((book)=>({
                id: book.id,
                title: book.title,
                authorName: book.author_name,
                authorId: book.author_id,
                price: book.price,
                imageUrl: book.image_url,
                description: book.description,
                category: book.category,
                coverType: book.cover_type,
                stock: book.stock,
                reorderPoint: book.reorder_point,
                bookFileUrl: book.book_file_url,
                publishedAt: book.published_at,
                sales: book.sales,
                revenue: book.revenue,
                averageRating: book.average_rating,
                totalReviews: book.total_reviews
            }));
    } catch (error) {
        console.error('Error getting books by author:', error);
        throw error;
    }
};
const getAllBooks = async ()=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').select('*').order('published_at', {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map((book)=>({
                id: book.id,
                title: book.title,
                authorName: book.author_name,
                authorId: book.author_id,
                price: book.price,
                imageUrl: book.image_url,
                description: book.description,
                category: book.category,
                coverType: book.cover_type,
                stock: book.stock,
                reorderPoint: book.reorder_point,
                bookFileUrl: book.book_file_url,
                publishedAt: book.published_at,
                sales: book.sales,
                revenue: book.revenue,
                averageRating: book.average_rating,
                totalReviews: book.total_reviews
            }));
    } catch (error) {
        console.error('Error getting all books:', error);
        throw error;
    }
};
const getBookById = async (bookId)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').select('*').eq('id', bookId).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;
        return {
            id: data.id,
            title: data.title,
            authorName: data.author_name,
            authorId: data.author_id,
            price: data.price,
            imageUrl: data.image_url,
            description: data.description,
            category: data.category,
            coverType: data.cover_type,
            stock: data.stock,
            reorderPoint: data.reorder_point,
            bookFileUrl: data.book_file_url,
            publishedAt: data.published_at,
            sales: data.sales,
            revenue: data.revenue,
            averageRating: data.average_rating,
            totalReviews: data.total_reviews
        };
    } catch (error) {
        console.error('Error getting book by ID:', error);
        throw error;
    }
};
const updateBook = async (bookId, updates)=>{
    try {
        const updateData = {};
        if (updates.title) updateData.title = updates.title;
        if (updates.authorName) updateData.author_name = updates.authorName;
        if (updates.price !== undefined) updateData.price = updates.price;
        if (updates.imageUrl) updateData.image_url = updates.imageUrl;
        if (updates.description) updateData.description = updates.description;
        if (updates.category) updateData.category = updates.category;
        if (updates.coverType) updateData.cover_type = updates.coverType;
        if (updates.stock !== undefined) updateData.stock = updates.stock;
        if (updates.reorderPoint !== undefined) updateData.reorder_point = updates.reorderPoint;
        if (updates.bookFileUrl) updateData.book_file_url = updates.bookFileUrl;
        if (updates.sales !== undefined) updateData.sales = updates.sales;
        if (updates.revenue !== undefined) updateData.revenue = updates.revenue;
        if (updates.averageRating !== undefined) updateData.average_rating = updates.averageRating;
        if (updates.totalReviews !== undefined) updateData.total_reviews = updates.totalReviews;
        updateData.updated_at = new Date().toISOString();
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').update(updateData).eq('id', bookId);
        if (error) throw error;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};
const createOrder = async (orderData)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('orders').insert({
            user_id: orderData.userId,
            books: orderData.books,
            total_amount: orderData.totalAmount,
            status: orderData.status,
            payment_method: orderData.paymentMethod,
            payment_gateway: orderData.paymentGateway,
            payment_id: orderData.paymentId,
            order_id: orderData.orderId,
            shipping_address: orderData.shippingAddress
        }).select().single();
        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
const updateOrderStatus = async (orderId, status, paymentId)=>{
    try {
        const updates = {
            status
        };
        if (paymentId) {
            updates.payment_id = paymentId;
        }
        if (status === 'completed') {
            updates.completed_at = new Date().toISOString();
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('orders').update(updates).eq('id', orderId);
        if (error) throw error;
        // If order is completed, update book sales and user purchased books
        if (status === 'completed') {
            const { data: order } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('*').eq('id', orderId).single();
            if (order) {
                // Update each book's sales and revenue
                for (const item of order.books){
                    const { data: book } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').select('sales, revenue, stock, author_id').eq('id', item.bookId).single();
                    if (book) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').update({
                            sales: (book.sales || 0) + item.quantity,
                            revenue: (book.revenue || 0) + item.price * item.quantity,
                            stock: (book.stock || 0) - item.quantity
                        }).eq('id', item.bookId);
                        // Update author stats
                        const { data: author } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('total_sales, total_revenue').eq('id', book.author_id).single();
                        if (author) {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                                total_sales: (author.total_sales || 0) + item.quantity,
                                total_revenue: (author.total_revenue || 0) + item.price * item.quantity
                            }).eq('id', book.author_id);
                        }
                    }
                }
                // Update user's purchased books
                const purchasedBookIds = order.books.map((item)=>item.bookId);
                const { data: user } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('purchased_books').eq('id', order.user_id).single();
                if (user) {
                    const updatedPurchasedBooks = [
                        ...user.purchased_books || [],
                        ...purchasedBookIds
                    ];
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                        purchased_books: updatedPurchasedBooks
                    }).eq('id', order.user_id);
                }
            }
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};
const getUserOrders = async (userId)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('*').eq('user_id', userId).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map((order)=>({
                id: order.id,
                userId: order.user_id,
                books: order.books,
                totalAmount: order.total_amount,
                status: order.status,
                paymentMethod: order.payment_method,
                paymentGateway: order.payment_gateway,
                paymentId: order.payment_id,
                orderId: order.order_id,
                createdAt: order.created_at,
                completedAt: order.completed_at,
                shippingAddress: order.shipping_address
            }));
    } catch (error) {
        console.error('Error getting user orders:', error);
        throw error;
    }
};
const createReview = async (reviewData)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('reviews').insert({
            book_id: reviewData.bookId,
            user_id: reviewData.userId,
            username: reviewData.username,
            rating: reviewData.rating,
            comment: reviewData.comment,
            author_reply: reviewData.authorReply,
            reader_follow_up: reviewData.readerFollowUp
        }).select().single();
        if (error) throw error;
        // Update book's review stats
        const { data: reviews } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('reviews').select('rating').eq('book_id', reviewData.bookId);
        if (reviews) {
            const totalRating = reviews.reduce((sum, review)=>sum + review.rating, 0);
            const totalReviews = reviews.length;
            const averageRating = totalRating / totalReviews;
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').update({
                total_reviews: totalReviews,
                average_rating: averageRating
            }).eq('id', reviewData.bookId);
        }
        return data.id;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};
const getBookReviews = async (bookId)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('reviews').select('*').eq('book_id', bookId).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map((review)=>({
                id: review.id,
                bookId: review.book_id,
                userId: review.user_id,
                username: review.username,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.created_at,
                authorReply: review.author_reply,
                readerFollowUp: review.reader_follow_up
            }));
    } catch (error) {
        console.error('Error getting book reviews:', error);
        throw error;
    }
};
const updateReview = async (reviewId, updates)=>{
    try {
        const updateData = {};
        if (updates.rating !== undefined) updateData.rating = updates.rating;
        if (updates.comment) updateData.comment = updates.comment;
        if (updates.authorReply !== undefined) updateData.author_reply = updates.authorReply;
        if (updates.readerFollowUp !== undefined) updateData.reader_follow_up = updates.readerFollowUp;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('reviews').update(updateData).eq('id', reviewId);
        if (error) throw error;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};
const followAuthor = async (readerId, authorId)=>{
    try {
        // Check if already following
        const { data: existingFollow } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('follows').select('id').eq('reader_id', readerId).eq('author_id', authorId).single();
        if (existingFollow) {
            throw new Error('Already following this author');
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('follows').insert({
            reader_id: readerId,
            author_id: authorId
        }).select().single();
        if (error) throw error;
        // Update reader's followed authors
        const { data: user } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('followed_authors').eq('id', readerId).single();
        if (user) {
            const updatedFollowedAuthors = [
                ...user.followed_authors || [],
                authorId
            ];
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                followed_authors: updatedFollowedAuthors
            }).eq('id', readerId);
        }
        return data.id;
    } catch (error) {
        console.error('Error following author:', error);
        throw error;
    }
};
const unfollowAuthor = async (readerId, authorId)=>{
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('follows').delete().eq('reader_id', readerId).eq('author_id', authorId);
        if (error) throw error;
        // Update reader's followed authors
        const { data: user } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('followed_authors').eq('id', readerId).single();
        if (user) {
            const updatedFollowedAuthors = (user.followed_authors || []).filter((id)=>id !== authorId);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                followed_authors: updatedFollowedAuthors
            }).eq('id', readerId);
        }
    } catch (error) {
        console.error('Error unfollowing author:', error);
        throw error;
    }
};
const getAuthorFollowers = async (authorId)=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('follows').select('*').eq('author_id', authorId);
        if (error) throw error;
        return (data || []).map((follow)=>({
                id: follow.id,
                readerId: follow.reader_id,
                authorId: follow.author_id,
                followedAt: follow.followed_at
            }));
    } catch (error) {
        console.error('Error getting author followers:', error);
        throw error;
    }
};
const hasUserPurchasedBook = async (userId, bookId)=>{
    try {
        const user = await getUserById(userId);
        return user?.purchasedBooks?.includes(bookId) || false;
    } catch (error) {
        console.error('Error checking book purchase:', error);
        throw error;
    }
};
const getAuthorAnalytics = async (authorId)=>{
    try {
        // For Supabase, we'll calculate analytics on demand from the users table
        const { data: user, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('total_books, total_sales, total_revenue').eq('id', authorId).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (!user) return null;
        // Get additional analytics from books table
        const { data: books } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('books').select('sales, revenue, average_rating').eq('author_id', authorId);
        const topBook = books?.reduce((prev, current)=>prev.sales > current.sales ? prev : current);
        return {
            authorId,
            totalBooks: user.total_books || 0,
            totalSales: user.total_sales || 0,
            totalRevenue: user.total_revenue || 0,
            averageRating: books?.reduce((sum, book)=>sum + (book.average_rating || 0), 0) / (books?.length || 1) || 0,
            topSellingBook: topBook ? {
                title: '',
                sales: topBook.sales || 0
            } : undefined,
            monthlyStats: [],
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting author analytics:', error);
        throw error;
    }
};
const updateAuthorAnalytics = async (authorId, updates)=>{
    try {
        // In Supabase, we update the user record directly
        const updateData = {};
        if (updates.totalBooks !== undefined) updateData.total_books = updates.totalBooks;
        if (updates.totalSales !== undefined) updateData.total_sales = updates.totalSales;
        if (updates.totalRevenue !== undefined) updateData.total_revenue = updates.totalRevenue;
        if (Object.keys(updateData).length > 0) {
            updateData.updated_at = new Date().toISOString();
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').update(updateData).eq('id', authorId);
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error updating author analytics:', error);
        throw error;
    }
};
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "comparePassword": (()=>comparePassword),
    "generateJWTToken": (()=>generateJWTToken),
    "getCurrentUser": (()=>getCurrentUser),
    "hashPassword": (()=>hashPassword),
    "onAuthStateChange": (()=>onAuthStateChange),
    "registerUser": (()=>registerUser),
    "signInUser": (()=>signInUser),
    "signOutUser": (()=>signOutUser),
    "validateEmail": (()=>validateEmail),
    "validatePassword": (()=>validatePassword),
    "verifyJWTToken": (()=>verifyJWTToken)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
;
;
;
const registerUser = async (email, password, firstName, lastName, role)=>{
    try {
        // Check if Supabase is configured
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
            // For development without Supabase, simulate user creation
            console.warn('Supabase not configured. Using mock authentication.');
            // Check if user already exists (mock)
            const existingUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            // Create mock user
            const mockUserId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
            const userData = {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                createdAt: new Date(),
                isActive: true
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createUser"])(userData);
            return {
                uid: mockUserId,
                email,
                role,
                firstName,
                lastName
            };
        }
        // Check if user already exists
        const existingUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Create user with Supabase Auth
        const { data: authData, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: role
                }
            }
        });
        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');
        // Hash password for database storage
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
        // Create user document in Supabase database
        const userData = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date(),
            isActive: true
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createUser"])(userData);
        return {
            uid: authData.user.id,
            email: authData.user.email,
            role,
            firstName,
            lastName
        };
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};
const signInUser = async (email, password)=>{
    try {
        // Get user from database to check role and status
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }
        // Verify password
        const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        // If Supabase is configured, sign in with Supabase Auth
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
            const { data: authData, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                email,
                password
            });
            if (authError) {
                console.warn('Supabase auth error:', authError.message);
            // Continue with mock auth if Supabase fails
            } else if (authData.user) {
                return {
                    uid: authData.user.id,
                    email: authData.user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                };
            }
        }
        // Mock authentication for development
        console.warn('Using mock authentication.');
        const mockUserId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            uid: mockUserId,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };
    } catch (error) {
        console.error('Error signing in user:', error);
        throw error;
    }
};
const signOutUser = async ()=>{
    try {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            if (error) throw error;
        } else {
            console.warn('Using mock sign out.');
        }
    } catch (error) {
        console.error('Error signing out user:', error);
        throw error;
    }
};
const getCurrentUser = async ()=>{
    try {
        const { data: { user }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};
const generateJWTToken = (user)=>{
    const payload = {
        uid: user.uid,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};
const verifyJWTToken = (token)=>{
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
const onAuthStateChange = (callback)=>{
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"]) {
        // Mock implementation for development
        console.warn('Supabase not configured. Using mock auth state listener.');
        // Return a mock unsubscribe function
        return ()=>{
            console.log('Mock auth state listener unsubscribed');
        };
    }
    const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((_event, session)=>{
        callback(session?.user || null);
    });
    // Return unsubscribe function
    return ()=>{
        subscription.unsubscribe();
    };
};
const validatePassword = (password)=>{
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
const validateEmail = (email)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const hashPassword = async (password)=>{
    return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
};
const comparePassword = async (password, hashedPassword)=>{
    return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hashedPassword);
};
}}),
"[project]/src/app/api/auth/login/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        // Validate input
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Email and password are required'
            }, {
                status: 400
            });
        }
        // Validate email format
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateEmail"])(email)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid email format'
            }, {
                status: 400
            });
        }
        // Sign in user
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signInUser"])(email, password);
        // Generate JWT token
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateJWTToken"])(user);
        // Set HTTP-only cookie
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Login successful',
            user: {
                uid: user.uid,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        }, {
            status: 200
        });
        // Set secure cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });
        return response;
    } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'User not found') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid email or password'
            }, {
                status: 401
            });
        }
        if (error.message === 'Account is deactivated') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Account is deactivated. Please contact support.'
            }, {
                status: 403
            });
        }
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid email or password'
            }, {
                status: 401
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Login failed. Please try again.'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__2830308b._.js.map