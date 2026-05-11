import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusTag } from '@/components/StatusTag';

describe('<StatusTag />', () => {
  it('renders Cần làm for todo', () => {
    render(<StatusTag status="todo" />);
    expect(screen.getByText('Cần làm')).toBeInTheDocument();
  });

  it('renders Đang làm for in_progress', () => {
    render(<StatusTag status="in_progress" />);
    expect(screen.getByText('Đang làm')).toBeInTheDocument();
  });

  it('renders Hoàn thành with success color for done', () => {
    render(<StatusTag status="done" />);
    const tag = screen.getByText('Hoàn thành');
    expect(tag).toBeInTheDocument();
    expect(tag.className).toMatch(/ant-tag-success/);
  });
});
