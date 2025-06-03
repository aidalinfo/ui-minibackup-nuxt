<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast/use-toast";
import { toTypedSchema } from "@vee-validate/zod";
import { Check, Circle, Dot } from "lucide-vue-next";
import { h, ref } from "vue";
import * as z from "zod";
import { useNuxtApp } from "#app";

const { $api } = useNuxtApp();

const route = useRoute();
const backupName = route.params.name as string;

const formSchema = [
  z.object({
    selectDestination: z.string(),
  }),
  z.object({
    selectedBackup: z.string(),
  }),
];

const stepIndex = ref(1);
const steps = [
  {
    step: 1,
    title: "Selection de la sauvegarde",
    description: "Veuillez selectionner la sauvegarde à restaurer",
  },
  {
    step: 2,
    title: "Selection de la destination",
    description: "Choisissez la location de destination de la restauration",
  },
  {
    step: 3,
    title: "Résumé",
    description: "Résumé de la restauration",
  },
];

const apiPostRestore = async (values: any) => {
  toast({
    title: "Restauration en cours",
    description: "La restauration est en cours",
  });
  try {
    const response = await $api.post(`/api/restore/${backupName}`, {
      pathFile: values.selectedBackup,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const { toast } = useToast();

function onSubmit(values: any) {
  console.log(values.selectedBackup, "Valeurs de la soumission");
  apiPostRestore(values)
    .then(() => {
      toast({
        title: "Restauration effectuée avec succès",
        description: "La restauration a été effectuée avec succès",
      });
    })
    .catch((error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la restauration",
        description: "Une erreur est survenue lors de la restauration",
        variant: "destructive",
      });
    });
}
</script>

<template>
  <div>
    <Card class="relative overflow-hidden rounded-lg xl:col-span-2">
      <CardHeader class="flex flex-row items-center">
        <div class="grid gap-2">
          <CardTitle>Assistant de restauration</CardTitle>
          <CardDescription> </CardDescription>
        </div>
        <!-- <Button as-child size="sm" class="ml-auto gap-1">
            <a href="#">
              View All
              <ArrowUpRight class="h-4 w-4" />
            </a>
          </Button> -->
      </CardHeader>

      <CardContent>
        <Form
          v-slot="{ meta, values, validate }"
          as=""
          keep-values
          :validation-schema="toTypedSchema(formSchema[stepIndex - 2])">
          <Stepper
            v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
            v-model="stepIndex"
            class="block w-full">
            <form
              @submit="
                (e) => {
                  e.preventDefault();
                  validate();
                  if (stepIndex === steps.length) {
                    onSubmit(values);
                  }
                }
              ">
              <div class="flex w-full flex-start gap-2">
                <StepperItem
                  v-for="step in steps"
                  :key="step.step"
                  v-slot="{ state }"
                  class="relative flex w-full flex-col items-center justify-center"
                  :step="step.step">
                  <StepperSeparator
                    v-if="step.step !== steps[steps.length - 1].step"
                    class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

                  <StepperTrigger as-child>
                    <Button
                      :variant="
                        state === 'completed' || state === 'active'
                          ? 'default'
                          : 'outline'
                      "
                      size="icon"
                      class="z-10 rounded-full shrink-0"
                      :class="[
                        state === 'active' &&
                          'ring-2 ring-ring ring-offset-2 ring-offset-background',
                      ]"
                      :disabled="state !== 'completed' && !meta.valid">
                      <Check
                        v-if="state === 'completed'"
                        class="size-5" />
                      <Circle v-if="state === 'active'" />
                      <Dot v-if="state === 'inactive'" />
                    </Button>
                  </StepperTrigger>

                  <div class="mt-5 flex flex-col items-center text-center">
                    <StepperTitle
                      :class="[state === 'active' && 'text-primary']"
                      class="text-sm font-semibold transition lg:text-base">
                      {{ step.title }}
                    </StepperTitle>
                    <StepperDescription
                      :class="[state === 'active' && 'text-primary']"
                      class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
                      {{ step.description }}
                    </StepperDescription>
                  </div>
                </StepperItem>
              </div>

              <div class="flex flex-col gap-4 mt-4">
                <template v-if="stepIndex === 1">
                  <FormField
                  v-slot="{ componentField }"
                  name="selectedBackup">
                  <FormItem>
                    <ListBackups v-bind="componentField" />
                  </FormItem>
                </FormField>
              </template>
              
              <template v-if="stepIndex === 2">
                  <Label for="Destination">Destination</Label>
                  <FormField
                    v-slot="{ componentField }"
                    name="selectDestination">
                    <FormItem>
                      <Select v-bind="componentField">
                        <SelectTrigger id="Destination">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="original">
                            Restauration de la sauvegarde sur la location
                            originale
                          </SelectItem>
                          <SelectItem
                            value="other"
                            disabled>
                            Restauration de la sauvegarde sur une autre location
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="stepIndex === 3">
                  <!-- <div class="z-10 flex flex-col gap-2 min-h-64 items-center justify-center">
              <h3 class="text-lg font-semibold">Résumé de la restauration</h3>
              <p><strong>Destination :</strong> {{ values.selectDestination || 'Non spécifié' }}</p>
              <p><strong>Sauvegarde sélectionnée :</strong> {{ values.selectedBackup || 'Non spécifié' }}</p>
            </div>
          </template> -->
                  <div class="grid gap-2 grid-cols-1 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Destination</CardTitle>
                        <CardDescription>
                          Système qui sera restauré à partir de la sauvegarde
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        Lieu : {{ values.selectDestination }}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Sauvegarde sélectionnée </CardTitle>
                        <CardDescription>
                          Sauvegarde sélectionnée qui sera utilisée pour la
                          restauration
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        Nom : {{ values.selectedBackup }}
                      </CardContent>
                    </Card>
                  </div>
                </template>
              </div>
              <div class="flex items-center justify-between mt-4">
                <Button
                  :disabled="isPrevDisabled"
                  variant="outline"
                  size="sm"
                  @click="prevStep()">
                  Back
                </Button>
                <div class="flex items-center gap-3">
                  <Button
                    v-if="stepIndex !== 3"
                    :type="meta.valid ? 'button' : 'submit'"
                    :disabled="isNextDisabled"
                    size="sm"
                    @click="meta.valid && nextStep()">
                    Next
                  </Button>
                  <Button
                    v-if="stepIndex === 3"
                    size="sm"
                    type="submit">
                    Restaurer
                  </Button>
                </div>
              </div>
            </form>
          </Stepper>
        </Form>
      </CardContent>
      <BorderBeam
        :size="250"
        :duration="12"
        :delay="0"
        :border-width="2"
        colorFrom="#ffaa40"
        colorTo="#9c40ff" />
    </Card>
  </div>
</template>
