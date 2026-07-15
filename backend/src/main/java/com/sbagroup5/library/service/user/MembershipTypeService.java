package com.sbagroup5.library.service.user;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.repository.user.MembershipTypeRepository;

@Service
@RequiredArgsConstructor
public class MembershipTypeService {
    private final MembershipTypeRepository membershipTypeRepository;

    public List<MembershipType> getAllMembershipTypes() {
        return membershipTypeRepository.findAll();
    }

    public Optional<MembershipType> getMembershipTypeById(Long id) {
        return membershipTypeRepository.findById(id);
    }

    public MembershipType createMembershipType(MembershipType membershipType) {
        return membershipTypeRepository.save(membershipType);
    }

    public MembershipType updateMembershipType(Long id, MembershipType membershipTypeDetails) {

        MembershipType membershipType =
                membershipTypeRepository.findById(id).orElse(null);

        if (membershipType != null) {

            membershipType.setName(membershipTypeDetails.getName());
            membershipType.setPrice(membershipTypeDetails.getPrice());
            membershipType.setBorrowLimit(
                    membershipTypeDetails.getBorrowLimit());
            membershipType.setBorrowDurationDay(
                    membershipTypeDetails.getBorrowDurationDay());
            membershipType.setDescription(
                    membershipTypeDetails.getDescription());
            membershipType.setUserStatus(
                    membershipTypeDetails.getUserStatus());

            return membershipTypeRepository.save(membershipType);
        }

        return null;
    }

    public void deleteMembershipType(Long id) {
        membershipTypeRepository.deleteById(id);
    }
}
