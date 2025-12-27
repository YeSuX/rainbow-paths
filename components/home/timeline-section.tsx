"use client";

import { TimelineChart } from "@/components/timeline-chart";
import { TimelineEventsList } from "@/components/timeline-events-list";
import { TimelineStats } from "@/components/timeline-stats";
import { SectionIntro } from "@/components/home/section-intro";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TimelineSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            全球法律进展时间线
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            追踪同性婚姻和民事结合在全球的立法进程
          </p>
        </div>

        <SectionIntro />

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="chart">📊 趋势图表</TabsTrigger>
            <TabsTrigger value="list">📋 事件列表</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <TimelineChart />
            </div>
            <TimelineStats />
          </TabsContent>

          <TabsContent value="list">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <TimelineEventsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

