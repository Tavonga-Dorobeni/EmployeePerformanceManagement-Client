<template>
  <div>
    <Card noborder>
      <Modal
        title="Edit Task"
        label=""
        labelClass="btn-small"
        ref="modal2"
        centered sizeClass="max-w-5xl"
      >
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="Description"
            type="text"
            v-model="currentTask.Description"
            placeholder="Enter Description"
            name="desc"
            :isReadonly="view"
          />
          <VueSelect v-if="!view" label="Site"
            ><vSelect :options="allSites.map(s => s.Name)" v-model="currentTask.Site"
          /></VueSelect>
          <Textinput
            v-else
            label="Site"
            type="text"
            :modelValue="currentTask.Site"
            name="site"
            isReadonly="true"
          />
        </div>

        <VueSelect v-if="!view" label="Skills"
          ><vSelect :options="allSkills.map(s => s.Name)" v-model="currentTask.Skills" multiple
        /></VueSelect>
        <Textinput
          v-else
          label="Skills"
          type="text"
          :modelValue="currentTask.Skills"
          name="skills"
          isReadonly="true"
        />

        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <FromGroup v-if="!view" label="Start Date" name="d1">
            <flat-pickr
              v-model="currentTask.StartDate"
              class="form-control"
              id="d1"
              placeholder="yyyy, dd M"
            />
          </FromGroup>
          <Textinput
            v-else
            label="Start Date"
            type="text"
            :modelValue="currentTask.StartDate"
            name="s_date"
            isReadonly="true"
          />

          <FromGroup v-if="!view" label="End Date" name="d2">
            <flat-pickr
              v-model="currentTask.EndDate"
              class="form-control"
              id="d2"
              placeholder="yyyy, dd M"
            />
          </FromGroup>
          <Textinput
            v-else
            label="End Date"
            type="text"
            :modelValue="currentTask.EndDate"
            name="e_date"
            isReadonly="true"
          />
        </div>

        <template v-if="!view" v-slot:footer>
          <Button
            text="Submit"
            btnClass="btn-dark "
            @click="updateTask()"
          />
        </template>
        <template v-else v-slot:footer>
          <Button
            text="Close"
            btnClass="btn-dark "
            @click="$refs.modal2.closeModal()"
          />
        </template>
      </Modal>

      <div
        class="md:flex pb-6 md:space-y-0 space-y-3 justify-between items-center"
      >
        <h6>Tasks List</h6>
        <InputGroup
          v-model="searchTerm"
          placeholder="Search"
          type="text"
          prependIcon="heroicons-outline:search"
          merged
        />
      </div>
      <vue-good-table
        class="-mx-6"
        :columns="columns"
        styleClass=" vgt-table  table-head   v-middle striped lesspadding2 listview"
        :rows="this.$store.state.task.tasks"
        :pagination-options="{
          enabled: true,
          perPage: perpage,
        }"
        :sort-options="{
          enabled: false,
        }"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm,
        }"
      >
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'Description'">
            <div class="flex space-x-3 items-center text-left">
              <div class="flex-none">
                <div
                  class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                >
                  TK
                </div>
              </div>
              <div
                class="flex-1 font-medium text-sm leading-4 whitespace-nowrap"
              >
                {{ props.row.Description }}
              </div>
            </div>
          </span>
          <span
            v-if="props.column.field == 'Status'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            <span
              v-if="props.row.Status == 'Pending' || props.row.Status == 'Assigned'"
              class="inline-block text-center space-x-1 bg-warning-500 bg-opacity-[0.16] min-w-[110px] text-warning-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
            >
              {{ props.row.Status}}
            </span>
            <span
              v-if="props.row.Status == 'Completed'"
              class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
            >
              {{ props.row.Status}}
            </span>
            <span
              v-if="props.row.Status == 'Overdue'"
              class="inline-block text-center space-x-1 bg-error-500 bg-opacity-[0.16] min-w-[110px] text-error-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
            >
              {{ props.row.Status}}
            </span>
          </span>

          <span
            v-if="props.column.field == 'StartDate'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.StartDate }}
          </span>

          <span
            v-if="props.column.field == 'EndDate'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.EndDate }}
          </span>

          <div
            v-if="props.column.field == 'action'"
            class="action-btn text-end mr-3"
          >
            <Dropdown classMenuItems=" w-[140px]">
              <div class="text-xl">
                <Icon icon="heroicons-outline:dots-vertical" />
              </div>
              <template v-slot:menus>
                <MenuItem v-for="(item, i) in actions" :key="i">
                  <div
                    @click="item.doit(props.row)"
                    :class="`
                
                  ${
                    item.name === 'delete'
                      ? 'bg-danger-500 text-danger-500 bg-opacity-30  hover:bg-opacity-100 hover:text-white'
                      : 'hover:bg-slate-900 hover:text-white'
                  }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
                  >
                    <span class="text-base"><Icon :icon="item.icon" /></span>
                    <span>{{ item.name }}</span>
                  </div>
                </MenuItem>
              </template>
            </Dropdown>
          </div>
        </template>
        <template #pagination-bottom="props">
          <div class="py-4 px-3 justify-center flex">
            <Pagination
              :total="$store.state.task.tasks.length"
              :current="current"
              :per-page="perpage"
              :pageRange="pageRange"
              @page-changed="current = $event"
              :pageChanged="props.pageChanged"
              :perPageChanged="props.perPageChanged"
            />
          </div>
        </template>
      </vue-good-table>
    </Card>
  </div>
</template>
<script>
import Card from '@/components/Card';
import Dropdown from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Pagination from '@/components/Pagination';
import ProgressBar from '@/components/ProgressBar';
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import VueSelect from "@/components/Select/VueSelect";
import FromGroup from "@/components/FromGroup";
import InputGroup from "@/components/InputGroup";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { advancedTable } from '../../../constant/basic-tablle-data';
import { mapGetters } from 'vuex';

export default {
  components: {
    Pagination,
    Dropdown,
    Icon,
    MenuItem,
    Card,
    ProgressBar,
    Modal,
    Textinput,
    Button,
    VueSelect,
    FromGroup,
    vSelect,
    InputGroup
  },

  data() {
    return {
      advancedTable,
      current: 1,
      perpage: 10,
      pageRange: 10,
      view: false,
      currentTask: {},
      searchTerm: "",
      actions: [
        {
          name: 'view',
          icon: 'heroicons:eye',
          doit: (data) => {
            data.Site = this.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0];
            data.Skills = this.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name);

            this.view = true;
            this.currentTask = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'edit',
          icon: 'heroicons:pencil-square',
          doit: (data) => {
            data.Site = this.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0];
            data.Skills = this.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name);

            this.view = false;
            this.currentTask = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'delete',
          icon: 'heroicons-outline:trash',
          doit: (data) => {
            const toast = useToast();
            this.$store.dispatch('deleteTask', data)
            .then(response => {
              toast.success(response.data.message, {
                timeout: 2000,
              });    
            },
            error => {
              toast.error((error.response && error.response.data) ||
                    error.message ||
                    error.toString(), {
                  timeout: 2000,
                });   
            })
          },
        },
      ],

      columns: [
        {
          label: 'Description',
          field: 'Description',
        },

        {
          label: 'Status',
          field: 'Status',
        },

        {
          label: 'Start Date',
          field: 'StartDate',
        },

        {
          label: 'End Date',
          field: 'EndDate',
        },

        {
          label: 'Action',
          field: 'action',
        },
      ],
    };
  },

  computed: {
    ...mapGetters([
      "activeData",
      "allTasks",
      "allSites",
      "allSkills"
    ])
  },

  methods: {
    updateTask(){
      const toast = useToast();
      this.currentTask.SiteID = this.allSites.filter(s => s.Name == this.currentTask.Site).map(s => s.SiteID)[0]
      this.currentTask.skills = this.allSkills.filter(s => this.currentTask.Skills.includes(s.Name)).map(sk => sk.SkillID)

      this.$store.dispatch('updateTask', this.currentTask)
      .then(response => {
        this.$refs.modal2.closeModal();
        toast.success(response.data.message, {
          timeout: 2000,
        });    
      },
      error => {
        this.$refs.modal2.closeModal();
        toast.error((error.response && error.response.data) ||
              error.data.message ||
              error.toString(), {
            timeout: 2000,
          });   
      })
    }
  },

  mounted(){
    this.$emitter.on('search', () => {
      this.searchTerm = this.activeData.searchTerm
    })
  }
};
</script>
<style lang="scss">
.listview {
  th {
    @apply last:text-end;
  }
}
</style>
