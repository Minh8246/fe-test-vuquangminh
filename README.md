# TaskBoard — fe-test-vuquangminh

## Cài đặt và chạy

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview
npm run test
npm run test:run
npm run lint
```

## Tính năng đã làm

- Dashboard 4 thẻ thống kê (Tổng task, Cần làm, Đang làm, Hoàn thành)
- Progress bar tỉ lệ theo trạng thái
- Danh sách 5 task tạo gần nhất
- Trang danh sách task với Antd Table
- Phân trang 10 items/trang, hiển thị tổng số bản ghi
- Sort theo Tiêu đề, Hạn chót, Độ ưu tiên
- Cột Trạng thái dùng Antd Tag với màu theo trạng thái
- Cột Độ ưu tiên với màu theo mức độ
- Đổi trạng thái nhanh inline bằng Select không mở Modal
- Thêm task mới qua Modal form
- Chỉnh sửa task qua Modal form, tự fill data cũ
- Validate required cho Tiêu đề, Trạng thái, Độ ưu tiên
- Mô tả textarea, Người được giao input, Hạn chót DatePicker, Tags select mode tags
- Xoá đơn lẻ với Modal confirm
- Chọn nhiều dòng và xoá hàng loạt
- Search theo tiêu đề
- Lọc đa Trạng thái 
- Lọc Độ ưu tiên
- Lọc khoảng Hạn chót bằng DatePicker.RangePicker
- Nút Reset xoá toàn bộ filter
- Logic filter nằm trong Redux selector dùng createSelector
- TypeScript strict mode
- Routing 2 trang Dashboard và Tasks
- Empty state, Modal confirm trước khi xoá
- Dark mode toggle
- Persist filter và pagination qua URL query params
- unit test
