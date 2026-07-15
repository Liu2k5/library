package com.sbagroup5.library.controller.admin;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbagroup5.library.record.OverallStatsResponse;
import com.sbagroup5.library.service.admin.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/dashboard")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overall")
    public OverallStatsResponse getOverall() {
        return dashboardService.getOverallStats();
    }
}