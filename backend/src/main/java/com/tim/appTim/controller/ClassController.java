package com.tim.appTim.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.appTim.dto.ClassDTO;
import com.tim.appTim.entity.Class;
import com.tim.appTim.entity.ClassMember;
import com.tim.appTim.service.ClassService;

@RestController
@RequestMapping("/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping("/{id}")
    public ClassDTO getClassInfo(@PathVariable Long id) {
        // Lấy thông tin lớp học
        Class classInfo = classService.getClassById(id)
                .orElseThrow(() -> new RuntimeException("Class not found with id: " + id));

        // Lấy danh sách thành viên của lớp
        List<ClassMember> members = classService.getClassMembersByClassId(id);

        // Chuyển đổi thành DTO để trả về
        ClassDTO classDTO = new ClassDTO(
                classInfo.getClassName(),
                classInfo.getDescription(),
                members.stream()
                        .map(member -> new ClassDTO.MemberDTO(
                                member.getUserId(), // Sử dụng userId thay vì nguoiDungId
                                member.getRole().name(), // Lấy tên role (hoc_vien, giang_vien)
                                member.getJoinDate()
                        ))
                        .collect(Collectors.toList())
        );

        return classDTO;
    }
}