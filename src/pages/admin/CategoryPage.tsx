import React, { useState, useMemo, useCallback, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/filter/FilterBar';
import CategoryForm, { type CategoryFormData } from './components/CategoryForm';
import TableCategoryParent from './components/TableCetagoryParent';
import TableCategoryChild from './components/TableCategoryChild';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type AdminCategory as Category,
} from '../../api/categories';

type StatusFilter = '' | 'active' | 'inactive';
type TabType = 'parent' | 'child';

const PAGE_SIZE = 10;

const statusColor: Record<'active' | 'inactive', string> = {
  active: 'bg-[#e6f4ee] text-[#12805c]',
  inactive: 'bg-[#f2f4f6] text-[#737686]',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const CategoriesPage: React.FC = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('parent');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [pageParent, setPageParent] = useState(1);
  const [pageChild, setPageChild] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formType, setFormType] = useState<'parent' | 'child'>('parent');

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getAdminCategories()
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (statusFilter === 'active') {
      filtered = filtered.filter((cat) => cat.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((cat) => !cat.isActive);
    }
    return filtered;
  }, [items, statusFilter]);

  const parentItems = useMemo(
    () => filteredItems.filter((cat) => cat.parentId === null),
    [filteredItems]
  );
  const childItems = useMemo(
    () => filteredItems.filter((cat) => cat.parentId !== null),
    [filteredItems]
  );

  const parentMap = useMemo(() => {
    const map: Record<string, string> = {};
    items
      .filter((cat) => cat.parentId === null)
      .forEach((cat) => {
        map[cat.id] = cat.name;
      });
    return map;
  }, [items]);

  const totalParent = parentItems.length;
  const totalParentPages = Math.ceil(totalParent / PAGE_SIZE);
  const startParent = (pageParent - 1) * PAGE_SIZE;
  const paginatedParent = parentItems.slice(startParent, startParent + PAGE_SIZE);

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

  const handleSave = async (data: CategoryFormData) => {
    const payload = {
      name: data.name,
      description: data.description.trim() || null,
      isActive: data.isActive,
      parentId: data.parentId || null,
    };
    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await createCategory(payload);
    }
    setEditingCategory(null);
    setPageParent(1);
    setPageChild(1);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin mau hapus kategori ini?')) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
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

        <div>
          <h1 className="text-[28px] font-bold text-[#101319]">Kategori</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola kategori produk dan subkategori marketplace.
          </p>
        </div>

        <div className="flex gap-2 border-b border-[#e0e3e5]">
          <button
            onClick={() => handleTabChange('parent')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'parent'
                ? 'border-[#538cbd] text-[#4077a6]'
                : 'border-transparent text-[#737686] hover:text-[#101319]'
            }`}
          >
            Kategori Induk
          </button>
          <button
            onClick={() => handleTabChange('child')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'child'
                ? 'border-[#538cbd] text-[#4077a6]'
                : 'border-transparent text-[#737686] hover:text-[#101319]'
            }`}
          >
            Subkategori
          </button>
        </div>

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

        {error && (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff0f0] p-4 text-[13px] text-[#93000a]">
            {error}
          </div>
        )}

        {activeTab === 'parent' ? (
          <TableCategoryParent
            isLoading={isLoading}
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
            isLoading={isLoading}
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