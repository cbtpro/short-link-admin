<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from 'vue';
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';
import { countAllUser } from '#/api';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';

// 单独存储用户总数
const userCount = ref(0);

onMounted(async () => {
  try {
    const count = await countAllUser();
    userCount.value = count;
  } catch (err) {
    console.error('获取用户总数失败:', err);
  }
});

const overviewItems = computed<AnalysisOverviewItem[]>(() => {
  return [
    {
      icon: SvgCardIcon,
      title: '用户量',
      totalTitle: '总用户量',
      totalValue: userCount.value,
      value: 2000,
    },
    {
      icon: SvgCakeIcon,
      title: '访问量',
      totalTitle: '总访问量',
      totalValue: 500_000,
      value: 20_000,
    },
    {
      icon: SvgDownloadIcon,
      title: '下载量',
      totalTitle: '总下载量',
      totalValue: 120_000,
      value: 8000,
    },
    {
      icon: SvgBellIcon,
      title: '使用量',
      totalTitle: '总使用量',
      totalValue: 50_000,
      value: 5000,
    },
  ];
});

const chartTabs: TabOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends />
      </template>
      <template #visits>
        <AnalyticsVisits />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="访问数量">
        <AnalyticsVisitsData />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="访问来源">
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/3" title="访问来源">
        <AnalyticsVisitsSales />
      </AnalysisChartCard>
    </div>
  </div>
</template>
