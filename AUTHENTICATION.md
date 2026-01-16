# 🔐 نظام المصادقة والحماية - التوثيق الشامل

## 📋 نظرة عامة

هذا المشروع يستخدم **Firebase Authentication** لإدارة المصادقة مع نظام حماية متعدد المستويات للصفحات.

---

## 🏗️ البنية الأساسية

### 1. AuthContext (`src/context/AuthContext.tsx`)

**المسؤولية:** إدارة حالة المصادقة عبر التطبيق بالكامل

**الميزات:**
- ✅ تسجيل الدخول عبر Google
- ✅ تسجيل الخروج
- ✅ مزامنة حالة المستخدم في الوقت الفعلي
- ✅ حفظ بيانات المستخدم في Firestore تلقائياً
- ✅ معالجة الأخطاء الشاملة

**الواجهة:**
```typescript
interface AuthContextType {
    user: User | null;           // المستخدم الحالي أو null
    loading: boolean;            // حالة التحميل
    error: string | null;        // رسائل الأخطاء
    signInWithGoogle: () => Promise<void>;  // تسجيل دخول Google
    logout: () => Promise<void>; // تسجيل الخروج
    clearError: () => void;      // مسح الأخطاء
}
```

**الاستخدام:**
```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
    const { user, loading, signInWithGoogle, logout } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    return user ? (
        <button onClick={logout}>Logout</button>
    ) : (
        <button onClick={signInWithGoogle}>Login with Google</button>
    );
}
```

---

### 2. Firebase Configuration (`src/lib/firebase.ts`)

**التحديث الأخير:** ✅ يستخدم المتغيرات البيئية من `.env.local`

**الإعدادات المطلوبة في `.env.local`:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🔒 نظام الحماية

### 1. حماية Admin Panel

**الملف:** `src/app/admin/layout.tsx`

**مستويات الحماية:**

#### المستوى الأول: فحص تسجيل الدخول
```typescript
if (!user && pathname !== "/admin/login") {
    router.push("/admin/login");
}
```
- إعادة توجيه المستخدمين غير المسجلين إلى صفحة تسجيل الدخول

#### المستوى الثاني: فحص الصلاحيات
```typescript
if (user && !ALLOWED_ADMINS.includes(user.email || "")) {
    alert("Access Denied. You are not an admin.");
    router.push("/");
}
```
- التحقق من أن المستخدم موجود في قائمة المشرفين المسموحين

#### المستوى الثالث: حالة التحميل
```typescript
if (loading) {
    return <div>Loading Admin...</div>;
}
```
- منع عرض المحتوى قبل التحقق من حالة المصادقة

---

### 2. قائمة المشرفين المسموحين

**الملف:** `src/lib/constants.ts`

```typescript
export const ALLOWED_ADMINS = [
    "montasrrm@gmail.com",
    "gemeslaim10@gmail.com"
];
```

**لإضافة مشرف جديد:**
1. افتح `src/lib/constants.ts`
2. أضف البريد الإلكتروني للمشرف الجديد
3. احفظ الملف

---

## 🔑 طرق تسجيل الدخول

### 1. تسجيل الدخول عبر Google (للمستخدمين العاديين)

**الاستخدام:**
```tsx
import { useAuth } from '@/context/AuthContext';

function LoginButton() {
    const { signInWithGoogle, error } = useAuth();
    
    return (
        <div>
            <button onClick={signInWithGoogle}>
                تسجيل الدخول عبر Google
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
```

**الأخطاء المحتملة:**
- `auth/popup-closed-by-user`: إغلاق النافذة المنبثقة
- `auth/popup-blocked`: حظر النافذة المنبثقة من المتصفح
- `auth/unauthorized-domain`: النطاق غير مصرح به في Firebase

---

### 2. تسجيل الدخول بالبريد والباسوورد (للمشرفين)

**المسار:** `/admin/login`
**الملف:** `src/app/admin/login/page.tsx`

**الميزات:**
- ✅ نموذج تسجيل دخول احترافي
- ✅ معالجة الأخطاء التفصيلية
- ✅ حماية من هجمات brute force
- ✅ إعادة توجيه تلقائي بعد النجاح

**الأخطاء المحتملة:**
- `auth/invalid-credential`: بريد أو كلمة مرور خاطئة
- `auth/user-not-found`: المستخدم غير موجود
- `auth/wrong-password`: كلمة المرور خاطئة
- `auth/too-many-requests`: محاولات كثيرة جداً

---

## 📊 تتبع نشاط المستخدمين

### useToolHistory Hook

**الملف:** `src/hooks/useToolHistory.ts`

**الوظيفة:** حفظ سجل استخدام الأدوات في Firestore

**الاستخدام:**
```tsx
import { useToolHistory } from '@/hooks/useToolHistory';

function MyTool() {
    const { addToHistory } = useToolHistory();
    
    const handleConvert = async () => {
        // ... منطق الأداة
        
        // حفظ في السجل (يحفظ فقط للمستخدمين المسجلين)
        addToHistory(
            'tool-id',           // معرف الأداة
            'اسم الأداة',        // اسم الأداة بالعربية
            'وصف العملية',      // وصف ما تم إنجازه
            'https://file.url',  // رابط الملف (اختياري)
            'video/audio/text'   // نوع الملف (اختياري)
        );
    };
}
```

**هيكل البيانات في Firestore:**
```typescript
{
    userId: string;          // معرف المستخدم
    toolId: string;          // معرف الأداة
    toolName: string;        // اسم الأداة
    description: string;     // وصف العملية
    fileUrl?: string;        // رابط الملف
    fileType?: string;       // نوع الملف
    createdAt: Timestamp;    // وقت الإنشاء
}
```

---

## 🔐 أفضل الممارسات الأمنية

### ✅ ما تم تطبيقه:

1. **فصل الأكواد السرية**
   - جميع المفاتيح في `.env.local`
   - لا توجد أكواد سرية في الكود المصدري

2. **المصادقة على مستوى العميل**
   - AuthContext يدير الحالة
   - useEffect لمراقبة تغيرات المصادقة

3. **حماية صفحات Admin**
   - فحص تسجيل الدخول
   - فحص الصلاحيات
   - قائمة مشرفين محدودة

4. **معالجة الأخطاء**
   - رسائل خطأ واضحة
   - معالجة جميع الحالات المحتملة

### ⚠️ توصيات إضافية:

1. **إضافة Middleware (Next.js)**
   ```typescript
   // middleware.ts (في جذر المشروع)
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';
   
   export function middleware(request: NextRequest) {
       // فحص الصلاحيات على مستوى السيرفر
   }
   
   export const config = {
       matcher: '/admin/:path*',
   };
   ```

2. **حماية API Routes**
   ```typescript
   // في أي API route
   import { auth } from '@/lib/firebase-admin';
   
   export async function POST(req: Request) {
       const token = req.headers.get('Authorization')?.split('Bearer ')[1];
       
       if (!token) {
           return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
       }
       
       try {
           const decodedToken = await auth.verifyIdToken(token);
           // المستخدم مصادق عليه
       } catch {
           return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
       }
   }
   ```

3. **Rate Limiting**
   - إضافة حماية من الطلبات المتكررة
   - استخدام Firebase App Check

4. **التسجيل والمراقبة**
   - تتبع محاولات تسجيل الدخول الفاشلة
   - تنبيهات عند الأنشطة المشبوهة

---

## 🧪 اختبار نظام المصادقة

### سيناريوهات الاختبار:

1. **تسجيل دخول ناجح (Google)**
   - افتح الصفحة الرئيسية
   - انقر على "تسجيل الدخول"
   - اختر حساب Google
   - تحقق من ظهور اسم المستخدم

2. **تسجيل دخول ناجح (Admin)**
   - انتقل إلى `/admin/login`
   - أدخل بريد وكلمة مرور صحيحة
   - تحقق من إعادة التوجيه إلى `/admin`

3. **منع الوصول (غير مصرح)**
   - سجل دخول بحساب غير موجود في ALLOWED_ADMINS
   - حاول الوصول إلى `/admin`
   - تحقق من رسالة "Access Denied"

4. **حفظ السجل**
   - سجل دخول كمستخدم عادي
   - استخدم أي أداة
   - انتقل إلى `/tools/history`
   - تحقق من ظهور النشاط

5. **تسجيل الخروج**
   - انقر على "تسجيل الخروج"
   - تحقق من إعادة التوجيه
   - تحقق من عدم القدرة على الوصول للصفحات المحمية

---

## 🐛 استكشاف الأخطاء

### مشكلة: "Firebase: Error (auth/unauthorized-domain)"
**الحل:**
1. افتح Firebase Console
2. انتقل إلى Authentication > Settings > Authorized domains
3. أضف النطاق الخاص بك (localhost:3000 للتطوير)

### مشكلة: "Access Denied" رغم وجود البريد في ALLOWED_ADMINS
**الحل:**
1. تحقق من تطابق البريد بالضبط (case-sensitive)
2. تحقق من عدم وجود مسافات زائدة
3. أعد تحميل الصفحة

### مشكلة: لا يتم حفظ السجل
**الحل:**
1. تحقق من تسجيل الدخول
2. افتح Console وابحث عن أخطاء Firestore
3. تحقق من صلاحيات Firestore Rules

---

## 📚 الموارد الإضافية

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**آخر تحديث:** 2026-01-16
**الحالة:** ✅ نظام المصادقة يعمل بشكل صحيح
