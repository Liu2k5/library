package com.sbagroup5.library.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.service.user.MembershipTypeService;


@RestController
@RequestMapping("/admin/membershiptypes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MembershipController {

    @Autowired
    private MembershipTypeService membershipTypeService;

    @GetMapping
    public List<MembershipType> getAll() {
        return membershipTypeService.getAllMembershipTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipType> getById(@PathVariable Long id) {
        return membershipTypeService.getMembershipTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MembershipType create(@RequestBody MembershipType membershipType) {
        return membershipTypeService.createMembershipType(membershipType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipType> update(
            @PathVariable Long id,
            @RequestBody MembershipType membershipType) {

        MembershipType updated =
                membershipTypeService.updateMembershipType(id, membershipType);

        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        membershipTypeService.deleteMembershipType(id);
        return ResponseEntity.ok().build();
    }
}