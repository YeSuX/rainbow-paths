"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStatsData } from "@/hooks/use-stats-data";
import {
  getSummaryTypeName,
  getSummaryTypeColor,
  getSummaryTypeBarColor,
  getMechanismName,
  getMechanismIcon,
} from "@/services/statsService";
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
    <section className="min-h-screen flex items-center justify-center bg-[#F7F6F3] px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#37352F] mb-3 sm:mb-4">
            全球统计分析
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#787774] max-w-2xl mx-auto px-4">
            基于 {totalCountries} 个国家和地区的数据分析
          </p>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto mb-6 sm:mb-8">
            <TabsTrigger value="summary" className="text-xs sm:text-sm">按状态分类</TabsTrigger>
            <TabsTrigger value="mechanism" className="text-xs sm:text-sm">按立法模式</TabsTrigger>
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
                        <span className="text-2xl font-bold text-[#37352F]">
                          {stat.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E3E2E0] rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getSummaryTypeBarColor(
                            stat.name
                          )}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <details className="text-sm text-[#787774]">
                        <summary className="cursor-pointer hover:text-[#37352F]">
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
                {/* Mobile: Card layout */}
                <div className="block md:hidden space-y-4">
                  {mechanismStats.map((stat) => (
                    <div
                      key={stat.name}
                      className="border border-[#E3E2E0] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2 font-medium text-[#37352F]">
                        <span className="text-xl">{getMechanismIcon(stat.name)}</span>
                        <span>{getMechanismName(stat.name)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-xs text-[#787774] mb-1">婚姻</div>
                          <Badge variant="blue">{stat.marriageCount}</Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#787774] mb-1">民事结合</div>
                          <Badge variant="purple">{stat.civilCount}</Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#787774] mb-1">总计</div>
                          <Badge className="bg-[#37352F] text-white">
                            {stat.totalCount}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden md:block overflow-x-auto">
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
                            <Badge variant="blue">
                              {stat.marriageCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="purple">
                              {stat.civilCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-[#37352F] text-white">
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
                      className="text-sm text-[#787774] border border-[#E3E2E0] rounded-lg p-4"
                    >
                      <summary className="cursor-pointer hover:text-[#37352F] font-medium">
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

