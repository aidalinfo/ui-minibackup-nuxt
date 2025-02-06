<template>
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <!-- <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Total Revenue
          </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            $45,231.89
          </div>
          <p class="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
       -->
      <ClientOnly>
        <BlurReveal :delay="0.2" :duration="0.75" class="">
          <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl leading-none">
            Tableau de bord 🚀 </h2>
          <!-- <span class="text-pretty text-xl tracking-tighter xl:text-4xl/none sm:text-3xl">
        Tableau de bord
      </span> -->
        </BlurReveal>
      </ClientOnly>
      <NextBackup/>

      <RStorageEnable/>
    </div>
    <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card class="relative overflow-hidden rounded-lg xl:col-span-2">
        <CardHeader class="flex flex-row items-center">
          <div class="grid gap-2">
            <CardTitle>Sauvegardes</CardTitle>
            <CardDescription>
              Résumé des sauvegardes actives.
            </CardDescription>
          </div>
          <!-- <Button as-child size="sm" class="ml-auto gap-1">
            <a href="#">
              View All
              <ArrowUpRight class="h-4 w-4" />
            </a>
          </Button> -->
        </CardHeader>

        <CardContent>
          <IDataTable />
        </CardContent>

        <!-- Le composant BorderBeam appliqué en superposition -->
        <BorderBeam :size="250" :duration="12" :delay="0" :border-width="2" colorFrom="#ffaa40" colorTo="#9c40ff" />
      </Card>
      <div>
      <LastBackups />
    </div>
    </div>
  </main>
</template>