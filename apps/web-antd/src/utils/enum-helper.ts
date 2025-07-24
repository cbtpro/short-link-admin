/**
 * 通用枚举工具函数：用于创建枚举数据的统一管理接口
 * @template T - 枚举值的类型
 * @param items - 枚举项的原始数据，包含 value 和 label
 * @param options - 可选参数：`includeAll` 用于是否包含 "全部" 选项，`allLabel` 用于定义 "全部" 选项的标签
 * @returns 返回一个对象，包括 `list`（下拉列表）、`map`（映射表）、`getLabel`（获取label的函数）
 */
export function createEnumHelper<T>(
	items: { value: T; label: string }[],
	options?: { includeAll?: boolean; allLabel?: string },
) {
	// 解构出 options，设置默认值
	const { includeAll = false, allLabel = '全部' } = options || {};

	// 如果需要包含“全部”选项，将其放在列表最前面
	const list = includeAll
		? [{ value: '' as any as T, label: allLabel }, ...items] // 添加 '全部' 选项
		: [...items]; // 如果不需要“全部”，直接返回原数据

	// 创建枚举值与标签的映射关系
	const map = new Map<T, string>(items.map(item => [item.value, item.label]));

	/**
	 * 根据 value 获取对应的 label
	 * @param value - 枚举值，支持传入空字符串（对应 "全部"）
	 * @returns 返回对应的 label，若无匹配返回 '--'
	 */
	function getLabel(value: T): string {
		// 如果是空字符串且包含 "全部"，返回 "全部" 标签
		if (value === '' && includeAll) return allLabel;
		// 如果 Map 中有该值，则返回对应的 label；否则返回默认值 '--'
		return map.get(value) || '--';
	}

	// 返回包含 list、map 和 getLabel 的对象
	return {
		list, // 用于下拉框的列表数据
		map, // 用于映射的 Map
		getLabel, // 获取 label 的函数
	};
}

