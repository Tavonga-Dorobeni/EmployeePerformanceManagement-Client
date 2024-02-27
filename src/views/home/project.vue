<template>
  <div>
    <!-- <Breadcrumb /> -->
    <h4 class="pb-5">Dashboard</h4>
    <div class="card-auto space-y-5">
      <div class="grid grid-cols-12 gap-5">
        <div class="lg:col-span-8 col-span-12 space-y-5">
          <Card title="Employees" noborder>
            <template #header>
              <SelectMonth />
            </template>
            <Teamtable
          /></Card>

          <div class="grid xl:grid-cols-2 grid-cols-1 gap-5">
            <!-- to do list -->
            <Card title="Task list">
              <template #header>
                <DropEvent />
              </template>
              <ul
                class="divide-y divide-slate-100 dark:divide-slate-700 -mx-6 -mb-6"
              >
                <li
                  class="flex items-center px-6 space-x-4 py-4"
                  v-for="item in TodoList"
                  :key="item.id"
                >
                  <div class="flex-none flex space-x-2 items-center">
                    <Checkbox v-model="item.isDone" />
                    <div
                      class="h-8 w-8 rounded-full text-white"
                      :class="item.isDone ? ' opacity-20' : ' opacity-100'"
                    >
                      <img
                        :src="item.image"
                        alt=""
                        class="block w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div
                    class="flex-1 flex"
                    :class="item.isDone ? 'line-through dark:text-white' : ''"
                  >
                    <span class="flex-1 text-sm text-slate-600 dark:text-slate-300">
                      {{ item.title.slice(0, 20) + '...' }}</span
                    >
                    <span class="flex-none space-x-2 text-base text-secondary-500">
                      <button type="button" v-if="item.isDone === false">
                        <Icon icon="heroicons-outline:pencil-alt" />
                      </button>
                      <button
                        type="button"
                        @click="removeTodo(item.id)"
                        class="transition duration-150 hover:text-danger-500"
                      >
                        <Icon icon="heroicons-outline:trash" />
                      </button>
                    </span>
                  </div>
                </li>
              </ul>
            </Card>
            <!-- active style two -->
            <Card title="Activity">
              <template #header>
                <DropEvent />
              </template>
              <ul class="relative pl-2">
                <li
                  v-for="(item, i) in trackingParcel.slice(0, 5)"
                  :key="i"
                  :class="
                    item.status === 'ok'
                      ? 'before:opacity-100'
                      : ' before:opacity-50'
                  "
                  class="border-l-2 border-slate-100 dark:border-slate-700 pb-4 last:border-none pl-[22px] relative before:absolute before:left-[-8px] before:top-[0px] before:rounded-full before:w-4 before:h-4 before:bg-slate-900 dark:before:bg-slate-600 before:leading-[2px] before:content-[url('@/assets/images/all-img/ck.svg')]"
                >
                  <div class="p-[10px] relative top-[-20px]">
                    <h2
                      class="text-sm font-medium dark:text-slate-400-900 mb-1 text-slate-600"
                    >
                      {{ item.title }}
                    </h2>
                    <p class="text-xs capitalize dark:text-slate-400">
                      {{ item.date }}
                    </p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        <div class="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Notes">
            <template #header>
              <button type="button" class="btn btn-dark btn-sm">
                Add More
              </button>
            </template>
            <div class="-mx-6 custom-calender">
              <v-calendar
                is-expanded
                :attributes="attributes"
                :is-dark="this.$store.state.isDark"
              />
            </div>
            <ul class="divide-y divide-slate-100 dark:divide-slate-700">
              <li v-for="(item, i) in meets" :key="i" class="block py-[10px]">
                <div class="flex space-x-2">
                  <div class="flex-1 flex space-x-2">
                    <div class="flex-none">
                      <div class="h-8 w-8">
                        <img
                          :src="item.img"
                          alt=""
                          class="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                        />
                      </div>
                    </div>
                    <div class="flex-1">
                      <span
                        class="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium"
                        >{{ item.title }}</span
                      >
                      <span
                        class="flex font-normal text-xs dark:text-slate-400 text-slate-500"
                      >
                        <span class="text-base inline-block mr-1"
                          ><Icon icon="heroicons-outline:video-camera"
                        /></span>
                        {{ item.meet }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-none">
                    <span
                      class="block text-xs text-slate-600 dark:text-slate-400"
                      >{{ item.date }}</span
                    >
                  </div>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from './Analytics-Component/Breadcrumbs';
import Card from '@/components/Card';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import { message, TodoList, trackingParcel } from '../../constant/data';

import {
  basicArea,
  basicAreaDark,
  donutTwo,
  donutTwoDark,
  pieChart,
} from './Analytics-Component/data';
import DropEvent from './Analytics-Component/DropEvent';
import SelectMonth from './Analytics-Component/SelectMonth';
import Teamtable from './Analytics-Component/Teamtable';
export default {
  components: {
    Card,
    Icon,
    Checkbox,
    Teamtable,
    DropEvent,
    Breadcrumb,
    SelectMonth,
  },
  data() {
    return {
      basicArea,
      basicAreaDark,
      pieChart,
      donutTwo,
      donutTwoDark,
      trackingParcel,
      message,
      TodoList,

      attributes: [
        {
          key: 'today',
          highlight: {
            color: 'gray-500',
            fillMode: 'solid',
          },

          dates: new Date(),
        },
        {},
      ],
      meets: [
        {
          img: require('@/assets/images/svg/sk.svg'),
          title: 'Meeting with client',
          date: '01 Nov 2021',
          meet: 'Zoom meeting',
        },
        {
          img: require('@/assets/images/svg/path.svg'),
          title: 'Design meeting (team)',
          date: '01 Nov 2021',
          meet: 'Skyp meeting',
        },
        {
          img: require('@/assets/images/svg/dc.svg'),
          title: 'Background research',
          date: '01 Nov 2021',
          meet: 'Google meeting',
        },
        {
          img: require('@/assets/images/svg/sk.svg'),
          title: 'Meeting with client',
          date: '01 Nov 2021',
          meet: 'Zoom meeting',
        },
      ],
      files: [
        {
          img: 'file-1.svg',
          title: 'Dashboard.fig',
          date: '06 June 2021 / 155MB',
        },
        {
          img: 'pdf-1.svg',
          title: 'Ecommerce.pdf',
          date: '06 June 2021 / 155MB',
        },
        {
          img: 'zip-1.svg',
          title: 'Job portal_app.zip',
          date: '06 June 2021 / 155MB',
        },
        {
          img: 'pdf-2.svg',
          title: 'Ecommerce.pdf',
          date: '06 June 2021 / 155MB',
        },
        {
          img: 'scr-1.svg',
          title: 'Screenshot.jpg',
          date: '06 June 2021 / 155MB',
        },
      ],
      statistics: [
        {
          title: 'Total Task',
          count: '64',
          bg: 'bg-info-500',
          text: 'text-info-500',
          percent: '25.67% ',
          icon: 'heroicons-outline:menu-alt-1',
        },
        {
          title: 'Completed ',
          count: '45',

          bg: 'bg-warning-500',
          text: 'text-warning-500',
          percent: '8.67%',
          icon: 'heroicons-outline:chart-pie',
        },
        {
          title: 'Hours',
          count: '190',
          bg: 'bg-primary-500',
          text: 'text-primary-500',
          percent: '1.67%  ',
          icon: 'heroicons-outline:clock',
        },
        {
          title: 'Spendings',
          count: '$3,564',
          bg: 'bg-success-500',
          text: 'text-success-500',
          percent: '11.67%  ',
          icon: 'heroicons-outline:calculator',
        },
      ],
      Campaigns: [
        {
          name: 'Channel',
          value: 'roi',
        },
        {
          name: 'Email',
          value: '40%',
        },
        {
          name: 'Website',
          value: '28%',
        },
        {
          name: 'Facebook',
          value: '34%',
        },
        {
          name: 'Offline',
          value: '17%',
        },
      ],
    };
  },
  methods: {
    removeTodo(i) {
      this.TodoList = this.TodoList.filter((todo) => {
        return todo.id !== i;
      });
    },
  },
};
</script>
<style lang="scss">
.custom-calender {
  .vc-pane-container,
  .vc-pane-layout,
  .vc-container,
  .vc-container * {
    border: none !important;
    font-family: 'Inter', sans-serif !important;
    //background: #fafbff !important;
    font-weight: 400;
  }
  .vc-title {
    color: #0f172a !important;
    font-size: 24px !important;
    font-weight: 500 !important;
    margin-bottom: 15px !important;
  }
  .vc-arrow {
    margin-left: 10px !important;
    margin-right: 10px !important;
    color: #0f172a !important;
  }
  .vc-weekday {
    @apply font-normal dark:text-slate-400 text-sm text-slate-600;
  }
  .vc-day {
    @apply text-slate-900 dark:text-white;
  }
  .vc-highlight {
    background-color: #0f172a !important;
  }
}
.dark {
  .custom-calender {
    .vc-title {
      color: #fff !important;
    }
    .vc-arrow {
      color: #fff !important;
    }
  }
  .vc-container,
  .vc-container {
    @apply bg-slate-800;
  }
}
</style>
