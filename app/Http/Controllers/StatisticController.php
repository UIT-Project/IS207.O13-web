<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class StatisticController extends Controller
{
    public function statisticRevenue(Request $request){
        $selectedOption = $request->input('selectedOption'); 
        $selectedMonth = $request->input('selectedMonth'); 
        $selectedYear = $request->input('selectedYear'); 
        $data = []; 
        if ($selectedOption === 'Tuần') {
            $firstDayOfMonth = date('Y-m-01', strtotime("$selectedYear-$selectedMonth-01"));
            $lastDayOfMonth = date('Y-m-t', strtotime("$selectedYear-$selectedMonth-01"));
        
        
            $currentDate = $firstDayOfMonth;
            $weekNumber = 1;
        
            while ($currentDate <= $lastDayOfMonth) {
                $nextWeek = date('Y-m-d', strtotime($currentDate . ' + 7 days'));
        
                $revenue = DB::select("
                    SELECT SUM(TONGTIENDONHANG) AS revenue 
                    FROM donhangs 
                    WHERE NGAYORDER BETWEEN ? AND ?
                    AND TRANGTHAI_DONHANG = 'Đã giao'
                ", [$currentDate, $nextWeek]);
        
                $data[] = [
                    'name' => "Tuần $weekNumber", 
                    'revenue' => $revenue[0]->revenue,
                    'currentDate' => $currentDate,
                    'nextWeek' => $nextWeek,
                ];
        
                $currentDate = $nextWeek;
                $weekNumber++;
            }
        }
        
        else if ($selectedOption === 'Tháng') { 

            for ($month = 1; $month <= 12; $month++) {
                $firstDayOfMonth = date('Y-m-01', strtotime("$selectedYear-$month-01"));
                $lastDayOfMonth = date('Y-m-t', strtotime("$selectedYear-$month-01"));

                $revenue = DB::select("
                    SELECT SUM(TONGTIENDONHANG) AS revenue 
                    FROM donhangs 
                    WHERE NGAYORDER BETWEEN ? AND ?
                    AND TRANGTHAI_DONHANG = 'Đã giao'
                ", [$firstDayOfMonth, $lastDayOfMonth]);

                $data[] = ['name' => "Tháng $month", 'revenue' => $revenue[0]->revenue];
            }
        }
        return response()->json([
            'data' => $data,  
        ]);
    }
    public function performModifyDataset()
    {
        //THỰC HIỆN INSERT DỮ LIỆU VÀO BẢNG HOÁ ĐƠN ĐỂ THỐNG KÊ
        $startDate = '2023-01-01';
        $endDate = '2023-12-31';

        $currentDate = $startDate;

        while ($currentDate <= $endDate) {
            DB::table('donhangs')->insert([
                'MATK' => 2,
                'NGAYORDER' => $currentDate,
                'NGAYGIAOHANG' => $currentDate, // Có thể là null hoặc giống ngày đặt hàng
                'TONGTIEN_SP' => rand(0, 999),
                'VOUCHERGIAM' => rand(0, 99),
                'TONGTIENDONHANG' => rand(50000, 60000),
                'PHIVANCHUYEN' => rand(0, 99),
                'HINHTHUC_THANHTOAN' => rand(0, 1) > 0.5 ? 'Chuyển khoản' : 'Thanh toán khi nhận hàng',
                'TRANGTHAI_THANHTOAN' => 'Đã thanh toán',
                'TRANGTHAI_DONHANG' => 'Đã giao hàng',
                'MATTGH' => 1,
                'GHICHU' => 'Ghi chú cho đơn hàng này'
            ]);

            // Tăng ngày thêm 1
            $currentDate = date('Y-m-d', strtotime($currentDate . ' +1 day'));
        }
 
        // DB::update("update donhangs set TRANGTHAI_DONHANG = 'Đã giao'");

    }
    public function statisticOrderAndPayMethod(Request $request){
        $chartType = $request->input('chartType'); 
        $startDate_HTTT_OR_TTDH = $request->input('startDate_HTTT_OR_TTDH'); 
        $endDate_HTTT_OR_TTDH = $request->input('endDate_HTTT_OR_TTDH'); 

        // $startDate_HTTT_OR_TTDH = Carbon::createFromFormat('Y-m-d', $startDate_HTTT_OR_TTDH)->format('Y-m-d');
        // $endDate_HTTT_OR_TTDH = Carbon::createFromFormat('Y-m-d', $endDate_HTTT_OR_TTDH)->format('Y-m-d');
        $period = "AND NGAYORDER BETWEEN '$startDate_HTTT_OR_TTDH' AND '$endDate_HTTT_OR_TTDH' ";

        $data_statisticOrderAndPayMethod = [];

        if($chartType == 0){
            $SLDG = DB::select(
                "SELECT COUNT(MADH) AS SLDG
                FROM donhangs 
                WHERE TRANGTHAI_DONHANG = 'Đã giao'
                $period"
            );
            $SLDH = DB::select(
                "SELECT COUNT(MADH) AS SLDH
                FROM donhangs 
                WHERE TRANGTHAI_DONHANG = 'Đã huỷ'
                $period"
            );
            $SLDG = $SLDG[0]->SLDG ?? 0;
            $SLDH = $SLDH[0]->SLDH ?? 0;

            $totalOrders = $SLDG + $SLDH;
 
            $data_statisticOrderAndPayMethod = [
                [
                    'name' => 'Đã giao',
                    'value' => $totalOrders > 0 ? ($SLDG / $totalOrders) * 100 : 0, // Tính phần trăm đã giao
                    'soluong' => $SLDG // Số lượng đã giao
                ],
                [
                    'name' => 'Đã huỷ',
                    'value' => $totalOrders > 0 ? ($SLDH / $totalOrders) * 100 : 0, // Tính phần trăm đã huỷ
                    'soluong' => $SLDH // Số lượng đã huỷ
                ]
            ];
        }
        else if($chartType == 1){
            $SLCK = DB::select(
                "SELECT COUNT(MADH) AS SLCK
                FROM donhangs 
                WHERE HINHTHUC_THANHTOAN = 'Chuyển khoản'
                $period"
            );
            $SLTTKNH = DB::select(
                "SELECT COUNT(MADH) AS SLTTKNH
                FROM donhangs 
                WHERE HINHTHUC_THANHTOAN = 'Thanh toán khi nhận hàng'
                $period"
            );
            $SLCK = $SLCK[0]->SLCK ?? 0;
            $SLTTKNH = $SLTTKNH[0]->SLTTKNH ?? 0;

            $totalOrders = $SLCK + $SLTTKNH;
 
            $data_statisticOrderAndPayMethod = [
                [
                    'name' => 'Chuyển khoản',
                    'value' => $totalOrders > 0 ? ($SLCK / $totalOrders) * 100 : 0, // Tính phần trăm đã giao
                    'soluong' => $SLCK // Số lượng đã giao
                ],
                [
                    'name' => 'Thanh toán khi nhận hàng',
                    'value' => $totalOrders > 0 ? ($SLTTKNH / $totalOrders) * 100 : 0, // Tính phần trăm đã huỷ
                    'soluong' => $SLTTKNH // Số lượng đã huỷ
                ]
            ];
        }

        return response()->json([
            'data_statisticOrderAndPayMethod' => $data_statisticOrderAndPayMethod,  
        ]);
    }
}
