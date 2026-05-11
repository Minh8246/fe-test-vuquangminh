import { DatePicker, Form, Input, Modal, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/types/task';
import { useAppDispatch } from '@/store/hooks';
import { addTask, updateTask } from './tasksSlice';

interface TaskFormValues {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: dayjs.Dayjs | null;
  tags?: string[];
}

interface TaskFormModalProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
}

const defaultValues: TaskFormValues = {
  title: '',
  status: 'todo',
  priority: 'medium',
};

const taskToFormValues = (task: Task): TaskFormValues => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  assignee: task.assignee,
  dueDate: task.dueDate ? dayjs(task.dueDate) : null,
  tags: task.tags,
});

export function TaskFormModal({ open, task, onClose }: TaskFormModalProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<TaskFormValues>();
  const isEdit = !!task;

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      status: values.status,
      priority: values.priority,
      assignee: values.assignee?.trim() || undefined,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      tags: values.tags && values.tags.length ? values.tags : undefined,
    };

    if (isEdit && task) {
      dispatch(updateTask({ ...task, ...payload }));
    } else {
      dispatch(addTask(payload));
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Chỉnh sửa task' : 'Thêm task mới'}
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Huỷ"
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnHidden
      width={640}
    >
      <Form
        form={form}
        key={task?.id ?? 'new'}
        layout="vertical"
        preserve={false}
        initialValues={task ? taskToFormValues(task) : defaultValues}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề' },
            { max: 120, message: 'Tối đa 120 ký tự' },
          ]}
        >
          <Input placeholder="Ví dụ: Thiết kế lại trang dashboard" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết (tuỳ chọn)" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: 'Chọn độ ưu tiên' }]}
          >
            <Radio.Group
              options={PRIORITY_OPTIONS}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

          <Form.Item name="assignee" label="Người được giao">
            <Input placeholder="Tên người phụ trách" />
          </Form.Item>

          <Form.Item name="dueDate" label="Hạn chót">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            placeholder="Nhập tag và Enter"
            tokenSeparators={[',']}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
