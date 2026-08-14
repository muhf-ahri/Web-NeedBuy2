// src/pages/admin/CategoriesPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/filter/FilterBar';
import CategoryForm, { type CategoryFormData } from './components/CategoryForm';
import TableCategoryParent from './components/TableCetagoryParent';
import TableCategoryChild from './components/TableCategoryChild';
import { DUMMY_CATEGORIES, type Category } from './data/categoryData';

type StatusFilter = '' | 'active' | 'inactive';
type TabType = 'parent' | 'child';

const PAGE_SIZE = 10;

const statusColor: Record<'active' | 'inactive', string> = {
  active: 'bg-[#d7f5dc] text-[#156b32]',
  inactive: 'bg-[#f2f4f6] text-[#737686]',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const CategoriesPage: React.FC = () => {
  const [items, setItems] = useState<Category[]>(DUMMY_CATEGORIES);
  const [activeTab, setActiveTab] = useState<TabType>('parent');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [pageParent, setPageParent] = useState(1);
  const [pageChild, setPageChild] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formType, setFormType] = useState<'parent' | 'child'>('parent');

  // Filter data berdasarkan status
  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (statusFilter === 'active') {
      filtered = filtered.filter((cat) => cat.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((cat) => !cat.isActive);
    }
    return filtered;
  }, [items, statusFilter]);

  // Pisahkan parent dan child
  const parentItems = useMemo(
    () => filteredItems.filter((cat) => cat.parentId === null),
    [filteredItems]
  );
  const childItems = useMemo(
    () => filteredItems.filter((cat) => cat.parentId !== null),
    [filteredItems]
  );

  // Parent map untuk child table
  const parentMap = useMemo(() => {
    const map: Record<string, string> = {};
    items
      .filter((cat) => cat.parentId === null)
      .forEach((cat) => {
        map[cat.id] = cat.name;
      });
    return map;
  }, [items]);

  // Pagination untuk parent
  const totalParent = parentItems.length;
  const totalParentPages = Math.ceil(totalParent / PAGE_SIZE);
  const startParent = (pageParent - 1) * PAGE_SIZE;
  const paginatedParent = parentItems.slice(startParent, startParent + PAGE_SIZE);

  // Pagination untuk child
  const totalChild = childItems.length;
  const totalChildPages = Math.ceil(totalChild / PAGE_SIZE);
  const startChild = (pageChild - 1) * PAGE_SIZE;
  const paginatedChild = childItems.slice(startChild, startChild + PAGE_SIZE);

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Aktif', value: 'active' },
    { label: 'Nonaktif', value: 'inactive' },
  ];

  const parentOptions = items
    .filter((cat) => cat.parentId === null)
    .map((cat) => ({ id: cat.id, name: cat.name }));

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setEditingCategory(null);
    setIsFormOpen(false);
  };

  const handleSave = (data: CategoryFormData) => {
    if (editingCategory) {
      setItems((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: data.name,
                description: data.description || null,
                isActive: data.isActive,
                parentId: data.parentId || null,
              }
            : cat
        )
      );
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
        parentId: data.parentId || null,
        createdAt: new Date().toISOString(),
        _count: { products: 0, children: 0 },
      };
      setItems((prev) => [newCategory, ...prev]);
    }
    setIsFormOpen(false);
    setEditingCategory(null);
    setPageParent(1);
    setPageChild(1);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    setItems((prev) => prev.filter((cat) => cat.id !== id));
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormType(category.parentId === null ? 'parent' : 'child');
    setIsFormOpen(true);
  };

  const openCreate = (type: 'parent' | 'child') => {
    setEditingCategory(null);
    setFormType(type);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Kategori</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola kategori produk dan subkategori marketplace.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e0e3e5]">
          <button
            onClick={() => handleTabChange('parent')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'parent'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Kategori Induk
          </button>
          <button
            onClick={() => handleTabChange('child')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'child'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Subkategori
          </button>
        </div>

        {/* Filter + Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={[
              {
                key: 'status',
                options: statusOptions,
                value: statusFilter,
                onChange: (val) => {
                  setStatusFilter(val as StatusFilter);
                  setPageParent(1);
                  setPageChild(1);
                },
              },
            ]}
            onMoreFilters={() => {}}
            moreFiltersLabel="More Filters"
            visibleFilters={1}
          />

          <Button
            variant="primary"
            onClick={() => openCreate(activeTab)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Icon name="plus" size={16} />
            {activeTab === 'parent' ? 'Tambah Induk' : 'Tambah Subkategori'}
          </Button>
        </div>

        {/* Tabel sesuai tab */}
        {activeTab === 'parent' ? (
          <TableCategoryParent
            data={paginatedParent}
            page={pageParent}
            totalPages={totalParentPages}
            totalItems={totalParent}
            pageSize={PAGE_SIZE}
            onPageChange={setPageParent}
            onEdit={openEdit}
            onDelete={handleDelete}
            statusColor={statusColor}
            formatDate={formatDate}
          />
        ) : (
          <TableCategoryChild
            data={paginatedChild}
            parentMap={parentMap}
            page={pageChild}
            totalPages={totalChildPages}
            totalItems={totalChild}
            pageSize={PAGE_SIZE}
            onPageChange={setPageChild}
            onEdit={openEdit}
            onDelete={handleDelete}
            statusColor={statusColor}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Category Form Modal */}
      {isFormOpen && (
        <CategoryForm
          editing={
            editingCategory
              ? {
                  name: editingCategory.name,
                  description: editingCategory.description || '',
                  isActive: editingCategory.isActive,
                  parentId: editingCategory.parentId,
                }
              : undefined
          }
          categories={parentOptions}
          onClose={closeForm}
          onSave={handleSave}
          title={
            editingCategory
              ? formType === 'parent'
                ? 'Edit Kategori Induk'
                : 'Edit Subkategori'
              : formType === 'parent'
              ? 'Tambah Kategori Induk'
              : 'Tambah Subkategori'
          }
          isChild={formType === 'child'}
        />
      )}
    </AdminLayout>
  );
};

export default CategoriesPage;