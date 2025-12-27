"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStatsData } from "@/hooks/use-stats-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function StatsSection() {
  const { summaryTypeStats, mechanismStats, totalCountries } =
    useStatsData();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50/50 px-6 py-20">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            全球统计分析
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            基于 {totalCountries} 个国家和地区的数据分析
          </p>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="summary">按状态分类</TabsTrigger>
            <TabsTrigger value="mechanism">按立法模式</TabsTrigger>
          </TabsList>

          {/* Summary Type Statistics */}
          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>全球覆盖率</CardTitle>
                <CardDescription>
                  按同性伴侣关系认可类型统计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {summaryTypeStats.map((stat) => (
                    <div key={stat.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {getSummaryTypeName(stat.name)}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getSummaryTypeColor(stat.name)}
                          >
                            {stat.count} 个国家/地区
                          </Badge>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {stat.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getSummaryTypeBarColor(
                            stat.name
                          )}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <details className="text-sm text-gray-600">
                        <summary className="cursor-pointer hover:text-gray-900">
                          查看国家列表 ({stat.count})
                        </summary>
                        <div className="mt-2 pl-4 flex flex-wrap gap-2">
                          {stat.countries.map((country) => (
                            <Badge key={country} variant="outline">
                              {country}
                            </Badge>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mechanism Statistics */}
          <TabsContent value="mechanism" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>立法模式分布</CardTitle>
                <CardDescription>
                  分析不同立法路径的使用情况
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>立法模式</TableHead>
                        <TableHead className="text-right">
                          用于婚姻
                        </TableHead>
                        <TableHead className="text-right">
                          用于民事结合
                        </TableHead>
                        <TableHead className="text-right">
                          总计国家数
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mechanismStats.map((stat) => (
                        <TableRow key={stat.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getMechanismIcon(stat.name)}
                              {getMechanismName(stat.name)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-blue-50">
                              {stat.marriageCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-purple-50">
                              {stat.civilCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-gray-900">
                              {stat.totalCount}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 space-y-4">
                  {mechanismStats.map((stat) => (
                    <details
                      key={stat.name}
                      className="text-sm text-gray-600 border rounded-lg p-4"
                    >
                      <summary className="cursor-pointer hover:text-gray-900 font-medium">
                        {getMechanismName(stat.name)} - 查看国家列表 (
                        {stat.totalCount})
                      </summary>
                      <div className="mt-3 pl-4 flex flex-wrap gap-2">
                        {stat.countries.map((country) => (
                          <Badge key={country} variant="outline">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

// Helper functions
function getSummaryTypeName(name: string): string {
  const names: Record<string, string> = {
    "Marriage & Civil Union": "婚姻 & 民事结合",
    "Marriage Only": "仅婚姻",
    Marriage: "婚姻",
    "Civil Union Only": "仅民事结合",
    No: "不支持",
    Varies: "因地区而异",
  };
  return names[name] || name;
}

function getSummaryTypeColor(name: string): string {
  const colors: Record<string, string> = {
    "Marriage & Civil Union": "bg-green-100 text-green-800",
    "Marriage Only": "bg-blue-100 text-blue-800",
    Marriage: "bg-blue-100 text-blue-800",
    "Civil Union Only": "bg-purple-100 text-purple-800",
    No: "bg-gray-100 text-gray-800",
    Varies: "bg-amber-100 text-amber-800",
  };
  return colors[name] || "bg-gray-100 text-gray-800";
}

function getSummaryTypeBarColor(name: string): string {
  const colors: Record<string, string> = {
    "Marriage & Civil Union": "bg-green-500",
    "Marriage Only": "bg-blue-500",
    Marriage: "bg-blue-500",
    "Civil Union Only": "bg-purple-500",
    No: "bg-gray-400",
    Varies: "bg-amber-500",
  };
  return colors[name] || "bg-gray-400";
}

function getMechanismName(name: string): string {
  const names: Record<string, string> = {
    Legislative: "立法",
    Judicial: "司法",
    Executive: "行政",
  };
  return names[name] || name;
}

function getMechanismIcon(name: string): string {
  const icons: Record<string, string> = {
    Legislative: "📜",
    Judicial: "⚖️",
    Executive: "🏛️",
  };
  return icons[name] || "📋";
}

