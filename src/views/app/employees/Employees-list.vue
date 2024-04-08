<template>
  <div>
    <Card noborder>
      <Modal
        title="Edit Employee"
        label=""
        labelClass="btn-small"
        ref="modal2"
        centered sizeClass="max-w-5xl"
      >
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <!-- <Textinput
            label="Employee Number"
            type="text"
            v-model="currentEmployee.EmployeeID"
            placeholder="------"
            name="employee_number"
            isReadonly="true"
          /> -->
          <VueSelect v-if="!view" label="Site"
            ><vSelect :options="allSites.map(s => s.Name)" v-model="currentEmployee.Site"
          /></VueSelect>
          <Textinput
            v-else
            label="Site"
            type="text"
            :modelValue="allSites.filter(s => s.SiteID == currentEmployee.SiteID).map(s => s.Name)[0]"
            name="site"
            isReadonly="true"
          />
          <VueSelect v-if="!view" label="Skills"
            ><vSelect :options="allSkills.map(s => s.Name)" v-model="currentEmployee.Skills" multiple
          /></VueSelect>
          <Textinput
            v-else
            label="Skills"
            type="text"
            v-model="currentEmployee.Skills"
            name="skills"
            isReadonly="true"
          />
          <Textinput
            label="Fullname"
            type="text"
            v-model="currentEmployee.FullName"
            placeholder="Enter FullName"
            name="fullName"
            :isReadonly="view"
          />
          <Textinput
            label="JobTitle"
            type="text"
            v-model="currentEmployee.JobTitle"
            placeholder="Enter Job Title"
            name="jobtitle"
            :isReadonly="view"
          />
          <Textinput
            label="Email"
            type="text"
            v-model="currentEmployee.Email"
            placeholder="Enter Email"
            name="email"
            :isReadonly="view"
          />
          <Textinput
            label="Mobile"
            type="text"
            v-model="currentEmployee.Phone"
            placeholder="Enter Phone"
            name="phone"
            :isReadonly="view"
          />
          <Textinput
            label="Latitude"
            type="text"
            v-model="currentEmployee.Latitude"
            placeholder="Enter Latitude"
            name="latitude"
            isReadonly
          />
          <Textinput
            label="Longitude"
            type="text"
            v-model="currentEmployee.Longitude"
            placeholder="Enter Longitude"
            name="longitude"
            isReadonly
          />
        </div>

        <template v-if="!view" v-slot:footer>
          <Button
            text="Submit"
            btnClass="btn-dark "
            @click="updateEmployee()"
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
        <h6>Employees List</h6>
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
        :rows="this.$store.state.employee.employees"
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
          <span v-if="props.column.field == 'FullName'">
            <div class="flex space-x-3 items-center text-left">
              <div class="flex-none">
                <div
                  class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                >
                  {{
                    props.row.FullName.charAt(0) +
                    props.row.FullName.charAt(props.row.FullName.length - 1)
                  }}
                </div>
              </div>
              <div
                class="flex-1 font-medium text-sm leading-4 whitespace-nowrap"
              >
                {{
                  props.row.FullName.length > 20
                    ? props.row.FullName.substring(0, 20) + '...'
                    : props.row.FullName
                }}
              </div>
            </div>
          </span>
          <span
            v-if="props.column.field == 'JobTitle'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.JobTitle }}
          </span>
          <span
            v-if="props.column.field == 'SiteID'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ allSites.filter(t => t.SiteID == props.row.SiteID).map(t => t.Name)[0] }}
          </span>
          <span
            v-if="props.column.field == 'Phone'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.Phone }}
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
              :total="$store.state.employee.employees.length"
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
      currentEmployee: {},
      searchTerm: "",
      actions: [
        {
          name: 'view',
          icon: 'heroicons:eye',
          doit: (data) => {
            data.Site = this.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
            data.Skills = data.skills.map(s => this.allSkills.filter(sk => sk.SkillID == s.SkillID).map(sk => sk.Name))
            this.view = true;
            this.currentEmployee = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'edit',
          icon: 'heroicons:pencil-square',
          doit: (data) => {
            data.Site = this.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
            data.Skills = data.skills.map(s => this.allSkills.filter(sk => sk.SkillID == s.SkillID).map(sk => sk.Name))
            this.view = false;
            this.currentEmployee = data;
            this.$refs.modal2.openModal();
          },
        },
        // {
        //   name: 'calibrate',
        //   icon: 'heroicons-outline:wrench',
        //   doit: (data) => {
        //     this.$store.commit('setActiveData', data);
        //     this.$router.push({ name: 'calibration' });
        //   },
        // },
        {
          name: 'delete',
          icon: 'heroicons-outline:trash',
          doit: (data) => {
            const toast = useToast();
            this.$store.dispatch('deleteEmployee', data)
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
          label: 'Fullname',
          field: 'FullName',
        },

        {
          label: 'Job Title',
          field: 'JobTitle',
        },

        {
          label: 'Site',
          field: 'SiteID',
        },
        {
          label: 'Mobile',
          field: 'Phone',
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
      "allSites",
      "allSkills"
    ])
  },

  methods: {
    updateEmployee(){
      const toast = useToast();
      this.currentEmployee.SiteID = this.allSites.filter(s => s.Name == this.currentEmployee.Site).map(s => s.SiteID)[0]
      this.currentEmployee.skills = this.currentEmployee.Skills.map(s => this.allSites.filter(sk => sk.Name == s.Name).map(sk => ({SkillID: sk.SkillID})))

      this.$store.dispatch('updateEmployee', this.currentEmployee)
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
